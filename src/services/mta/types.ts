// MTA API Types
export interface GTFSRealtimeEntity {
  id: string;
  trip_update?: {
    trip: {
      trip_id: string;
      route_id: string;
      direction_id?: number;
    };
    stop_time_update: Array<{
      stop_id: string;
      arrival?: {
        time: number;
        delay?: number;
      };
      departure?: {
        time: number;
        delay?: number;
      };
    }>;
  };
  vehicle?: {
    trip: {
      trip_id: string;
      route_id: string;
      direction_id?: number;
    };
    position?: {
      latitude: number;
      longitude: number;
    };
    current_stop_sequence?: number;
    current_status?: string;
    timestamp?: number;
  };
  alert?: {
    active_period: Array<{
      start?: number;
      end?: number;
    }>;
    informed_entity: Array<{
      agency_id?: string;
      route_id?: string;
      route_type?: number;
      trip?: {
        trip_id?: string;
        route_id?: string;
        direction_id?: number;
        start_time?: string;
        start_date?: string;
        schedule_relationship?: string;
      };
      stop_id?: string;
    }>;
    cause?: string;
    effect?: string;
    url?: {
      translation: Array<{
        text: string;
        language?: string;
      }>;
    };
    header_text?: {
      translation: Array<{
        text: string;
        language?: string;
      }>;
    };
    description_text?: {
      translation: Array<{
        text: string;
        language?: string;
      }>;
    };
  };
}

export interface GTFSRealtimeMessage {
  entity: GTFSRealtimeEntity[];
}

export interface ServiceAlert {
  id: string;
  title: string;
  description: string;
  affectedLines: string[];
  severity: 'info' | 'warning' | 'severe';
  startTime?: Date;
  endTime?: Date;
  url?: string;
}