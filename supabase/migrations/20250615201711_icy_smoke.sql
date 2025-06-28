/*
  # MTA Meetup App Database Schema

  1. New Tables
    - `profiles` - User profiles with display names and preferences
    - `meetup_sessions` - Active meetup sessions with codes and metadata
    - `session_participants` - Participants in each meetup session
    - `location_updates` - Real-time location tracking for participants
    - `mta_stations` - NYC subway station reference data
    - `train_data` - Real-time train information cache

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
    - Session creators can manage their sessions
    - Participants can update their own locations

  3. Real-time Features
    - Location updates trigger real-time subscriptions
    - Session status changes are broadcast to all participants
    - Automatic cleanup of old sessions and location data
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles table for user information
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name text NOT NULL DEFAULT '',
  avatar_url text,
  preferences jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

-- MTA Stations reference table
CREATE TABLE IF NOT EXISTS mta_stations (
  id text PRIMARY KEY,
  name text NOT NULL,
  borough text NOT NULL,
  lines text[] NOT NULL DEFAULT '{}',
  coordinates point,
  accessibility_features text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Train data cache for real-time information
CREATE TABLE IF NOT EXISTS train_data (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  train_id text NOT NULL,
  line text NOT NULL,
  direction text NOT NULL,
  current_station text REFERENCES mta_stations(id),
  next_station text REFERENCES mta_stations(id),
  estimated_arrival timestamptz,
  actual_arrival timestamptz,
  cars integer DEFAULT 8,
  status text DEFAULT 'on_time',
  delay_minutes integer DEFAULT 0,
  last_updated timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Meetup sessions table
CREATE TABLE IF NOT EXISTS meetup_sessions (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  code text UNIQUE NOT NULL,
  created_by uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  station_id text REFERENCES mta_stations(id),
  train_id text,
  train_line text,
  train_direction text,
  target_car integer,
  status text DEFAULT 'active' CHECK (status IN ('active', 'boarding', 'in_transit', 'completed', 'cancelled')),
  expires_at timestamptz DEFAULT (now() + interval '4 hours'),
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Session participants table
CREATE TABLE IF NOT EXISTS session_participants (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id uuid REFERENCES meetup_sessions(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name text NOT NULL,
  status text DEFAULT 'waiting' CHECK (status IN ('waiting', 'boarding', 'on_train', 'found', 'left')),
  joined_at timestamptz DEFAULT now(),
  left_at timestamptz,
  UNIQUE(session_id, user_id)
);

-- Location updates table for real-time tracking
CREATE TABLE IF NOT EXISTS location_updates (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  participant_id uuid REFERENCES session_participants(id) ON DELETE CASCADE,
  session_id uuid REFERENCES meetup_sessions(id) ON DELETE CASCADE,
  location_type text DEFAULT 'platform' CHECK (location_type IN ('platform', 'train', 'car')),
  station_id text REFERENCES mta_stations(id),
  train_id text,
  car_number integer,
  car_position text CHECK (car_position IN ('front', 'middle', 'rear')),
  coordinates point,
  accuracy_meters integer,
  created_at timestamptz DEFAULT now()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_meetup_sessions_code ON meetup_sessions(code);
CREATE INDEX IF NOT EXISTS idx_meetup_sessions_created_by ON meetup_sessions(created_by);
CREATE INDEX IF NOT EXISTS idx_meetup_sessions_status ON meetup_sessions(status);
CREATE INDEX IF NOT EXISTS idx_meetup_sessions_expires_at ON meetup_sessions(expires_at);

CREATE INDEX IF NOT EXISTS idx_session_participants_session_id ON session_participants(session_id);
CREATE INDEX IF NOT EXISTS idx_session_participants_user_id ON session_participants(user_id);

CREATE INDEX IF NOT EXISTS idx_location_updates_participant_id ON location_updates(participant_id);
CREATE INDEX IF NOT EXISTS idx_location_updates_session_id ON location_updates(session_id);
CREATE INDEX IF NOT EXISTS idx_location_updates_created_at ON location_updates(created_at);

CREATE INDEX IF NOT EXISTS idx_train_data_line ON train_data(line);
CREATE INDEX IF NOT EXISTS idx_train_data_current_station ON train_data(current_station);
CREATE INDEX IF NOT EXISTS idx_train_data_last_updated ON train_data(last_updated);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE meetup_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE session_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE location_updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE mta_stations ENABLE ROW LEVEL SECURITY;
ALTER TABLE train_data ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can read own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for meetup_sessions
CREATE POLICY "Users can read sessions they created or joined"
  ON meetup_sessions
  FOR SELECT
  TO authenticated
  USING (
    created_by = auth.uid() OR
    id IN (
      SELECT session_id FROM session_participants 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create sessions"
  ON meetup_sessions
  FOR INSERT
  TO authenticated
  WITH CHECK (created_by = auth.uid());

CREATE POLICY "Session creators can update their sessions"
  ON meetup_sessions
  FOR UPDATE
  TO authenticated
  USING (created_by = auth.uid());

-- RLS Policies for session_participants
CREATE POLICY "Users can read participants in their sessions"
  ON session_participants
  FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid() OR
    session_id IN (
      SELECT id FROM meetup_sessions 
      WHERE created_by = auth.uid()
    ) OR
    session_id IN (
      SELECT session_id FROM session_participants 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can join sessions"
  ON session_participants
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their participation"
  ON session_participants
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

-- RLS Policies for location_updates
CREATE POLICY "Users can read location updates in their sessions"
  ON location_updates
  FOR SELECT
  TO authenticated
  USING (
    session_id IN (
      SELECT session_id FROM session_participants 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert their own location updates"
  ON location_updates
  FOR INSERT
  TO authenticated
  WITH CHECK (
    participant_id IN (
      SELECT id FROM session_participants 
      WHERE user_id = auth.uid()
    )
  );

-- RLS Policies for mta_stations (public read access)
CREATE POLICY "Anyone can read station data"
  ON mta_stations
  FOR SELECT
  TO authenticated
  USING (true);

-- RLS Policies for train_data (public read access)
CREATE POLICY "Anyone can read train data"
  ON train_data
  FOR SELECT
  TO authenticated
  USING (true);

-- Functions for automatic updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at columns
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_meetup_sessions_updated_at
  BEFORE UPDATE ON meetup_sessions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_mta_stations_updated_at
  BEFORE UPDATE ON mta_stations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to clean up expired sessions
CREATE OR REPLACE FUNCTION cleanup_expired_sessions()
RETURNS void AS $$
BEGIN
  -- Mark expired sessions as cancelled
  UPDATE meetup_sessions 
  SET status = 'cancelled', updated_at = now()
  WHERE expires_at < now() AND status = 'active';
  
  -- Clean up old location updates (older than 24 hours)
  DELETE FROM location_updates 
  WHERE created_at < now() - interval '24 hours';
  
  -- Clean up old train data (older than 1 hour)
  DELETE FROM train_data 
  WHERE last_updated < now() - interval '1 hour';
END;
$$ language 'plpgsql';

-- Function to get latest location for a participant
CREATE OR REPLACE FUNCTION get_latest_location(participant_uuid uuid)
RETURNS location_updates AS $$
DECLARE
  latest_location location_updates;
BEGIN
  SELECT * INTO latest_location
  FROM location_updates
  WHERE participant_id = participant_uuid
  ORDER BY created_at DESC
  LIMIT 1;
  
  RETURN latest_location;
END;
$$ language 'plpgsql';

-- Insert sample MTA station data
INSERT INTO mta_stations (id, name, borough, lines, coordinates) VALUES
  ('127N', 'Times Square-42nd Street', 'Manhattan', ARRAY['N','Q','R','W','S','1','2','3','7'], point(-73.9855, 40.7580)),
  ('635', 'Union Square-14th Street', 'Manhattan', ARRAY['N','Q','R','W','4','5','6','L'], point(-73.9911, 40.7359)),
  ('631', 'Grand Central-42nd Street', 'Manhattan', ARRAY['4','5','6','7','S'], point(-73.9772, 40.7527)),
  ('R16', 'Herald Square-34th Street', 'Manhattan', ARRAY['B','D','F','M','N','Q','R','W'], point(-73.9884, 40.7505)),
  ('D24', 'Atlantic Avenue-Barclays Center', 'Brooklyn', ARRAY['B','D','N','Q','R','W','2','3','4','5'], point(-73.9772, 40.6840)),
  ('902', '14th Street-Union Square', 'Manhattan', ARRAY['L'], point(-73.9911, 40.7359)),
  ('A32', 'Jay Street-MetroTech', 'Brooklyn', ARRAY['A','C','F','R'], point(-73.9873, 40.6924)),
  ('G22', 'Court Square-23rd Street', 'Queens', ARRAY['E','M','7','G'], point(-73.9454, 40.7470)),
  ('F20', '42nd Street-Bryant Park', 'Manhattan', ARRAY['B','D','F','M','7'], point(-73.9840, 40.7544)),
  ('L08', 'Bedford Avenue', 'Brooklyn', ARRAY['L'], point(-73.9565, 40.7171)),
  ('R11', '8th Street-NYU', 'Manhattan', ARRAY['N','Q','R','W'], point(-73.9923, 40.7308)),
  ('A25', 'Fulton Street', 'Manhattan', ARRAY['A','C','J','Z','2','3','4','5'], point(-74.0067, 40.7097)),
  ('D21', 'DeKalb Avenue', 'Brooklyn', ARRAY['B','D','N','Q','R','W'], point(-73.9814, 40.6896)),
  ('418', '59th Street-Columbus Circle', 'Manhattan', ARRAY['A','B','C','D','1'], point(-73.9819, 40.7681)),
  ('R20', 'Canal Street', 'Manhattan', ARRAY['N','Q','R','W','J','Z','6'], point(-74.0002, 40.7190))
ON CONFLICT (id) DO NOTHING;