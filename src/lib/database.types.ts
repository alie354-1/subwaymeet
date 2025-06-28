export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          user_id: string
          display_name: string
          avatar_url: string | null
          preferences: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          display_name?: string
          avatar_url?: string | null
          preferences?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          display_name?: string
          avatar_url?: string | null
          preferences?: Json
          created_at?: string
          updated_at?: string
        }
      }
      mta_stations: {
        Row: {
          id: string
          name: string
          borough: string
          lines: string[]
          coordinates: unknown | null
          accessibility_features: string[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          name: string
          borough: string
          lines?: string[]
          coordinates?: unknown | null
          accessibility_features?: string[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          borough?: string
          lines?: string[]
          coordinates?: unknown | null
          accessibility_features?: string[]
          created_at?: string
          updated_at?: string
        }
      }
      train_data: {
        Row: {
          id: string
          train_id: string
          line: string
          direction: string
          current_station: string | null
          next_station: string | null
          estimated_arrival: string | null
          actual_arrival: string | null
          cars: number
          status: string
          delay_minutes: number
          last_updated: string
          created_at: string
        }
        Insert: {
          id?: string
          train_id: string
          line: string
          direction: string
          current_station?: string | null
          next_station?: string | null
          estimated_arrival?: string | null
          actual_arrival?: string | null
          cars?: number
          status?: string
          delay_minutes?: number
          last_updated?: string
          created_at?: string
        }
        Update: {
          id?: string
          train_id?: string
          line?: string
          direction?: string
          current_station?: string | null
          next_station?: string | null
          estimated_arrival?: string | null
          actual_arrival?: string | null
          cars?: number
          status?: string
          delay_minutes?: number
          last_updated?: string
          created_at?: string
        }
      }
      meetup_sessions: {
        Row: {
          id: string
          code: string
          created_by: string
          station_id: string | null
          train_id: string | null
          train_line: string | null
          train_direction: string | null
          target_car: number | null
          status: string
          expires_at: string
          metadata: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          code: string
          created_by: string
          station_id?: string | null
          train_id?: string | null
          train_line?: string | null
          train_direction?: string | null
          target_car?: number | null
          status?: string
          expires_at?: string
          metadata?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          code?: string
          created_by?: string
          station_id?: string | null
          train_id?: string | null
          train_line?: string | null
          train_direction?: string | null
          target_car?: number | null
          status?: string
          expires_at?: string
          metadata?: Json
          created_at?: string
          updated_at?: string
        }
      }
      session_participants: {
        Row: {
          id: string
          session_id: string
          user_id: string
          display_name: string
          status: string
          joined_at: string
          left_at: string | null
        }
        Insert: {
          id?: string
          session_id: string
          user_id: string
          display_name: string
          status?: string
          joined_at?: string
          left_at?: string | null
        }
        Update: {
          id?: string
          session_id?: string
          user_id?: string
          display_name?: string
          status?: string
          joined_at?: string
          left_at?: string | null
        }
      }
      location_updates: {
        Row: {
          id: string
          participant_id: string
          session_id: string
          location_type: string
          station_id: string | null
          train_id: string | null
          car_number: number | null
          car_position: string | null
          coordinates: unknown | null
          accuracy_meters: number | null
          created_at: string
        }
        Insert: {
          id?: string
          participant_id: string
          session_id: string
          location_type?: string
          station_id?: string | null
          train_id?: string | null
          car_number?: number | null
          car_position?: string | null
          coordinates?: unknown | null
          accuracy_meters?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          participant_id?: string
          session_id?: string
          location_type?: string
          station_id?: string | null
          train_id?: string | null
          car_number?: number | null
          car_position?: string | null
          coordinates?: unknown | null
          accuracy_meters?: number | null
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      cleanup_expired_sessions: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      get_latest_location: {
        Args: {
          participant_uuid: string
        }
        Returns: {
          id: string
          participant_id: string
          session_id: string
          location_type: string
          station_id: string | null
          train_id: string | null
          car_number: number | null
          car_position: string | null
          coordinates: unknown | null
          accuracy_meters: number | null
          created_at: string
        }
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}