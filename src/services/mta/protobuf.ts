import protobuf from 'protobufjs';

// Official GTFS-Realtime protobuf schema from https://developers.google.com/transit/gtfs-realtime/reference
const gtfsRealtimeSchema = `
syntax = "proto2";

package transit_realtime;

message FeedMessage {
  required FeedHeader header = 1;
  repeated FeedEntity entity = 2;
  
  extensions 1000 to 1999;
}

message FeedHeader {
  required string gtfs_realtime_version = 1;
  optional Incrementality incrementality = 2 [default = FULL_DATASET];
  optional uint64 timestamp = 3;
  
  extensions 1000 to 1999;
  
  enum Incrementality {
    FULL_DATASET = 0;
    DIFFERENTIAL = 1;
  }
}

message FeedEntity {
  required string id = 1;
  optional bool is_deleted = 2 [default = false];
  optional TripUpdate trip_update = 3;
  optional VehiclePosition vehicle = 4;
  optional Alert alert = 5;
  
  extensions 1000 to 1999;
}

message TripUpdate {
  required TripDescriptor trip = 1;
  optional VehicleDescriptor vehicle = 3;
  repeated StopTimeUpdate stop_time_update = 2;
  optional uint64 timestamp = 4;
  optional int32 delay = 5;
  
  extensions 1000 to 1999;
}

message StopTimeUpdate {
  optional uint32 stop_sequence = 1;
  optional string stop_id = 4;
  optional StopTimeEvent arrival = 2;
  optional StopTimeEvent departure = 3;
  optional ScheduleRelationship schedule_relationship = 5 [default = SCHEDULED];
  
  extensions 1000 to 1999;
  
  enum ScheduleRelationship {
    SCHEDULED = 0;
    SKIPPED = 1;
    NO_DATA = 2;
  }
}

message StopTimeEvent {
  optional int32 delay = 1;
  optional int64 time = 2;
  optional int32 uncertainty = 3;
  
  extensions 1000 to 1999;
}

message VehiclePosition {
  optional TripDescriptor trip = 1;
  optional VehicleDescriptor vehicle = 8;
  optional Position position = 2;
  optional uint32 current_stop_sequence = 3;
  optional string stop_id = 7;
  optional VehicleStopStatus current_status = 4 [default = IN_TRANSIT_TO];
  optional uint64 timestamp = 5;
  optional CongestionLevel congestion_level = 6;
  optional OccupancyStatus occupancy_status = 9;
  
  extensions 1000 to 1999;
  
  enum VehicleStopStatus {
    INCOMING_AT = 0;
    STOPPED_AT = 1;
    IN_TRANSIT_TO = 2;
  }
  
  enum CongestionLevel {
    UNKNOWN_CONGESTION_LEVEL = 0;
    RUNNING_SMOOTHLY = 1;
    STOP_AND_GO = 2;
    CONGESTION = 3;
    SEVERE_CONGESTION = 4;
  }
  
  enum OccupancyStatus {
    EMPTY = 0;
    MANY_SEATS_AVAILABLE = 1;
    FEW_SEATS_AVAILABLE = 2;
    STANDING_ROOM_ONLY = 3;
    CRUSHED_STANDING_ROOM_ONLY = 4;
    FULL = 5;
    NOT_ACCEPTING_PASSENGERS = 6;
  }
}

message Position {
  required float latitude = 1;
  required float longitude = 2;
  optional float bearing = 3;
  optional double odometer = 4;
  optional float speed = 5;
  
  extensions 1000 to 1999;
}

message TripDescriptor {
  optional string trip_id = 1;
  optional string route_id = 5;
  optional uint32 direction_id = 6;
  optional string start_time = 2;
  optional string start_date = 3;
  optional ScheduleRelationship schedule_relationship = 4;
  
  extensions 1000 to 1999;
  
  enum ScheduleRelationship {
    SCHEDULED = 0;
    ADDED = 1;
    UNSCHEDULED = 2;
    CANCELED = 3;
  }
}

message VehicleDescriptor {
  optional string id = 1;
  optional string label = 2;
  optional string license_plate = 3;
  
  extensions 1000 to 1999;
}

message Alert {
  repeated TimeRange active_period = 1;
  repeated EntitySelector informed_entity = 5;
  optional Cause cause = 6 [default = UNKNOWN_CAUSE];
  optional Effect effect = 7 [default = UNKNOWN_EFFECT];
  optional TranslatedString url = 8;
  optional TranslatedString header_text = 10;
  optional TranslatedString description_text = 11;
  
  extensions 1000 to 1999;
  
  enum Cause {
    UNKNOWN_CAUSE = 1;
    OTHER_CAUSE = 2;
    TECHNICAL_PROBLEM = 3;
    STRIKE = 4;
    DEMONSTRATION = 5;
    ACCIDENT = 6;
    HOLIDAY = 7;
    WEATHER = 8;
    MAINTENANCE = 9;
    CONSTRUCTION = 10;
    POLICE_ACTIVITY = 11;
    MEDICAL_EMERGENCY = 12;
  }
  
  enum Effect {
    NO_SERVICE = 1;
    REDUCED_SERVICE = 2;
    SIGNIFICANT_DELAYS = 3;
    DETOUR = 4;
    ADDITIONAL_SERVICE = 5;
    MODIFIED_SERVICE = 6;
    OTHER_EFFECT = 7;
    UNKNOWN_EFFECT = 8;
    STOP_MOVED = 9;
    NO_EFFECT = 10;
    ACCESSIBILITY_ISSUE = 11;
  }
}

message TimeRange {
  optional uint64 start = 1;
  optional uint64 end = 2;
  
  extensions 1000 to 1999;
}

message EntitySelector {
  optional string agency_id = 1;
  optional string route_id = 2;
  optional int32 route_type = 3;
  optional TripDescriptor trip = 4;
  optional string stop_id = 5;
  
  extensions 1000 to 1999;
}

message TranslatedString {
  repeated Translation translation = 1;
  
  extensions 1000 to 1999;
}

message Translation {
  required string text = 1;
  optional string language = 2;
  
  extensions 1000 to 1999;
}
`;

export class ProtobufParser {
  private root: protobuf.Root | null = null;
  private FeedMessage: protobuf.Type | null = null;

  async initialize(): Promise<void> {
    try {
      this.root = protobuf.parse(gtfsRealtimeSchema).root;
      this.FeedMessage = this.root.lookupType('transit_realtime.FeedMessage');
      console.log('Protobuf parser initialized successfully');
    } catch (error) {
      console.error('Failed to initialize protobuf parser:', error);
      throw new Error('Protobuf parser initialization failed');
    }
  }

  parseFeedMessage(buffer: ArrayBuffer): any | null {
    if (!this.FeedMessage) {
      throw new Error('Protobuf parser not initialized');
    }

    try {
      const uint8Array = new Uint8Array(buffer);
      console.log(`Attempting to parse ${uint8Array.length} bytes of protobuf data`);
      
      // Validate that we have actual protobuf data
      if (uint8Array.length === 0) {
        console.warn('Empty buffer received');
        return null;
      }

      // Check for common protobuf markers
      const firstByte = uint8Array[0];
      if (firstByte === 0 || firstByte > 127) {
        console.warn('Buffer does not appear to contain valid protobuf data');
        return null;
      }

      const message = this.FeedMessage.decode(uint8Array);
      const result = this.FeedMessage.toObject(message, {
        longs: String,
        enums: String,
        bytes: String,
        defaults: false,
        arrays: true,
        objects: true,
        oneofs: true
      });

      console.log(`Successfully parsed protobuf message with ${result.entity?.length || 0} entities`);
      return result;
    } catch (error) {
      console.error('Failed to parse protobuf message:', error);
      
      // Try to provide more specific error information
      if (error instanceof Error) {
        if (error.message.includes('wire type')) {
          console.error('Wire type error suggests incompatible protobuf schema or corrupted data');
        } else if (error.message.includes('index out of range')) {
          console.error('Buffer truncation or invalid length field detected');
        }
      }
      
      return null;
    }
  }

  parseAlerts(buffer: ArrayBuffer): any[] {
    try {
      const feedMessage = this.parseFeedMessage(buffer);
      if (!feedMessage || !feedMessage.entity) {
        console.warn('No valid feed message or entities found for alerts');
        return [];
      }
      
      const alerts = feedMessage.entity.filter((entity: any) => entity.alert);
      console.log(`Found ${alerts.length} alert entities`);
      return alerts;
    } catch (error) {
      console.error('Failed to parse alerts:', error);
      return [];
    }
  }

  parseTripUpdates(buffer: ArrayBuffer): any[] {
    try {
      const feedMessage = this.parseFeedMessage(buffer);
      if (!feedMessage || !feedMessage.entity) {
        console.warn('No valid feed message or entities found for trip updates');
        return [];
      }
      
      const tripUpdates = feedMessage.entity.filter((entity: any) => entity.tripUpdate);
      console.log(`Found ${tripUpdates.length} trip update entities`);
      return tripUpdates;
    } catch (error) {
      console.error('Failed to parse trip updates:', error);
      return [];
    }
  }

  parseVehiclePositions(buffer: ArrayBuffer): any[] {
    try {
      const feedMessage = this.parseFeedMessage(buffer);
      if (!feedMessage || !feedMessage.entity) {
        console.warn('No valid feed message or entities found for vehicle positions');
        return [];
      }
      
      const vehicles = feedMessage.entity.filter((entity: any) => entity.vehicle);
      console.log(`Found ${vehicles.length} vehicle position entities`);
      return vehicles;
    } catch (error) {
      console.error('Failed to parse vehicle positions:', error);
      return [];
    }
  }

  // Utility method to validate protobuf data
  validateBuffer(buffer: ArrayBuffer): boolean {
    if (!buffer || buffer.byteLength === 0) {
      return false;
    }

    const uint8Array = new Uint8Array(buffer);
    
    // Basic protobuf validation - check for valid varint encoding
    try {
      let pos = 0;
      while (pos < uint8Array.length) {
        const byte = uint8Array[pos];
        
        // Check for valid field number and wire type
        const wireType = byte & 0x07;
        const fieldNumber = byte >> 3;
        
        if (fieldNumber === 0) {
          return false; // Invalid field number
        }
        
        if (wireType > 5) {
          return false; // Invalid wire type
        }
        
        pos++;
        
        // Skip ahead based on wire type
        if (wireType === 0) { // Varint
          while (pos < uint8Array.length && (uint8Array[pos] & 0x80) !== 0) {
            pos++;
          }
          pos++; // Skip the last byte
        } else if (wireType === 1) { // 64-bit
          pos += 8;
        } else if (wireType === 2) { // Length-delimited
          if (pos >= uint8Array.length) return false;
          const length = uint8Array[pos++];
          pos += length;
        } else if (wireType === 5) { // 32-bit
          pos += 4;
        }
        
        if (pos > uint8Array.length) {
          return false;
        }
        
        // Only check first few fields for performance
        if (pos > 100) break;
      }
      
      return true;
    } catch (error) {
      return false;
    }
  }
}

// Singleton instance
export const protobufParser = new ProtobufParser();