import { supabase, getCurrentUser } from '../lib/supabase';
import { Database } from '../lib/database.types';
import { MeetupSession, Participant, Station, Train } from '../types';

type Tables = Database['public']['Tables'];
type MeetupSessionRow = Tables['meetup_sessions']['Row'];
type SessionParticipantRow = Tables['session_participants']['Row'];
type LocationUpdateRow = Tables['location_updates']['Row'];

export class MeetupService {
  // Generate a unique 6-character session code
  private generateSessionCode(): string {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  }

  // Create a new meetup session
  async createSession(
    station: Station,
    train?: Train,
    targetCar?: { number: number; position: 'front' | 'middle' | 'rear' }
  ): Promise<MeetupSession> {
    const user = await getCurrentUser();
    if (!user) throw new Error('User not authenticated');

    const code = this.generateSessionCode();
    
    // Create the session
    const { data: sessionData, error: sessionError } = await supabase
      .from('meetup_sessions')
      .insert({
        code,
        created_by: user.id,
        station_id: station.id,
        train_id: train?.id,
        train_line: train?.line,
        train_direction: train?.direction,
        target_car: targetCar?.number,
        metadata: {
          station,
          train,
          targetCarPosition: targetCar?.position
        }
      })
      .select()
      .single();

    if (sessionError) throw sessionError;

    // Get or create user profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('display_name')
      .eq('user_id', user.id)
      .single();

    const displayName = profile?.display_name || 'Anonymous User';

    // Add creator as first participant
    const { data: participantData, error: participantError } = await supabase
      .from('session_participants')
      .insert({
        session_id: sessionData.id,
        user_id: user.id,
        display_name: displayName,
        status: train ? 'on_train' : 'waiting'
      })
      .select()
      .single();

    if (participantError) throw participantError;

    // Create initial location update
    if (targetCar) {
      await supabase
        .from('location_updates')
        .insert({
          participant_id: participantData.id,
          session_id: sessionData.id,
          location_type: 'car',
          station_id: station.id,
          train_id: train?.id,
          car_number: targetCar.number,
          car_position: targetCar.position
        });
    }

    return this.mapSessionFromDatabase(sessionData, [participantData]);
  }

  // Join an existing session
  async joinSession(code: string, displayName: string): Promise<MeetupSession> {
    const user = await getCurrentUser();
    if (!user) throw new Error('User not authenticated');

    // Find the session
    const { data: sessionData, error: sessionError } = await supabase
      .from('meetup_sessions')
      .select('*')
      .eq('code', code.toUpperCase())
      .eq('status', 'active')
      .single();

    if (sessionError || !sessionData) {
      throw new Error('Session not found or expired');
    }

    // Update user profile
    await supabase
      .from('profiles')
      .upsert({
        user_id: user.id,
        display_name: displayName
      });

    // Add user as participant
    const { data: participantData, error: participantError } = await supabase
      .from('session_participants')
      .insert({
        session_id: sessionData.id,
        user_id: user.id,
        display_name: displayName,
        status: 'waiting'
      })
      .select()
      .single();

    if (participantError) throw participantError;

    // Create initial location update (platform)
    await supabase
      .from('location_updates')
      .insert({
        participant_id: participantData.id,
        session_id: sessionData.id,
        location_type: 'platform',
        station_id: sessionData.station_id
      });

    // Get all participants
    const participants = await this.getSessionParticipants(sessionData.id);
    
    return this.mapSessionFromDatabase(sessionData, participants);
  }

  // Get session by ID
  async getSession(sessionId: string): Promise<MeetupSession | null> {
    const { data: sessionData, error } = await supabase
      .from('meetup_sessions')
      .select('*')
      .eq('id', sessionId)
      .single();

    if (error || !sessionData) return null;

    const participants = await this.getSessionParticipants(sessionId);
    return this.mapSessionFromDatabase(sessionData, participants);
  }

  // Update participant location
  async updateLocation(
    sessionId: string,
    location: {
      type: 'platform' | 'train' | 'car';
      stationId?: string;
      trainId?: string;
      carNumber?: number;
      carPosition?: 'front' | 'middle' | 'rear';
      coordinates?: [number, number];
      accuracy?: number;
    }
  ): Promise<void> {
    const user = await getCurrentUser();
    if (!user) throw new Error('User not authenticated');

    // Get participant ID
    const { data: participant, error: participantError } = await supabase
      .from('session_participants')
      .select('id')
      .eq('session_id', sessionId)
      .eq('user_id', user.id)
      .single();

    if (participantError || !participant) {
      throw new Error('Participant not found');
    }

    // Create location update
    await supabase
      .from('location_updates')
      .insert({
        participant_id: participant.id,
        session_id: sessionId,
        location_type: location.type,
        station_id: location.stationId,
        train_id: location.trainId,
        car_number: location.carNumber,
        car_position: location.carPosition,
        coordinates: location.coordinates ? `POINT(${location.coordinates[1]} ${location.coordinates[0]})` : null,
        accuracy_meters: location.accuracy ? Math.round(location.accuracy) : null
      });

    // Update participant status based on location
    let status = 'waiting';
    if (location.type === 'train') status = 'boarding';
    if (location.type === 'car') status = 'on_train';

    await supabase
      .from('session_participants')
      .update({ status })
      .eq('id', participant.id);
  }

  // Leave a session
  async leaveSession(sessionId: string): Promise<void> {
    const user = await getCurrentUser();
    if (!user) throw new Error('User not authenticated');

    await supabase
      .from('session_participants')
      .update({ 
        status: 'left',
        left_at: new Date().toISOString()
      })
      .eq('session_id', sessionId)
      .eq('user_id', user.id);
  }

  // Subscribe to session updates
  subscribeToSession(sessionId: string, callback: (session: MeetupSession) => void) {
    const channel = supabase
      .channel(`session-${sessionId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'session_participants',
          filter: `session_id=eq.${sessionId}`
        },
        async () => {
          const session = await this.getSession(sessionId);
          if (session) callback(session);
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'location_updates',
          filter: `session_id=eq.${sessionId}`
        },
        async () => {
          const session = await this.getSession(sessionId);
          if (session) callback(session);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }

  // Helper methods
  private async getSessionParticipants(sessionId: string): Promise<SessionParticipantRow[]> {
    const { data, error } = await supabase
      .from('session_participants')
      .select('*')
      .eq('session_id', sessionId)
      .neq('status', 'left');

    if (error) throw error;
    return data || [];
  }

  private async getLatestLocation(participantId: string): Promise<LocationUpdateRow | null> {
    const { data, error } = await supabase
      .from('location_updates')
      .select('*')
      .eq('participant_id', participantId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error) return null;
    return data;
  }

  private async mapSessionFromDatabase(
    sessionData: MeetupSessionRow,
    participantsData: SessionParticipantRow[]
  ): Promise<MeetupSession> {
    // Get station data
    const { data: stationData } = await supabase
      .from('mta_stations')
      .select('*')
      .eq('id', sessionData.station_id)
      .single();

    const station: Station = stationData ? {
      id: stationData.id,
      name: stationData.name,
      borough: stationData.borough,
      lines: stationData.lines,
      coordinates: [0, 0] // Would parse from PostGIS point
    } : {
      id: sessionData.station_id || '',
      name: 'Unknown Station',
      borough: 'Unknown',
      lines: [],
      coordinates: [0, 0]
    };

    // Map participants with their latest locations
    const participants: Participant[] = await Promise.all(
      participantsData.map(async (p) => {
        const latestLocation = await this.getLatestLocation(p.id);
        
        return {
          id: p.user_id,
          name: p.display_name,
          location: {
            type: (latestLocation?.location_type as any) || 'platform',
            station: latestLocation?.station_id,
            trainId: latestLocation?.train_id,
            carNumber: latestLocation?.car_number,
            position: (latestLocation?.car_position as any) || 'middle'
          },
          status: (p.status as any) || 'waiting',
          lastUpdated: new Date(latestLocation?.created_at || p.joined_at)
        };
      })
    );

    // Create train object if available
    const train: Train | undefined = sessionData.train_line ? {
      id: sessionData.train_id || '',
      line: sessionData.train_line,
      direction: (sessionData.train_direction as any) || 'downtown',
      currentStation: sessionData.station_id || '',
      nextStation: '',
      estimatedArrival: new Date(),
      cars: 8,
      status: 'on_time'
    } : undefined;

    return {
      id: sessionData.id,
      code: sessionData.code,
      createdBy: sessionData.created_by,
      createdAt: new Date(sessionData.created_at),
      station,
      train,
      participants,
      status: (sessionData.status as any) || 'active'
    };
  }
}

export const meetupService = new MeetupService();