import { Station, Train } from '../types';
import { MTA_STATIONS } from './mtaService';

export interface DeviceLocation {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: Date;
}

export interface LocationUpdate {
  type: 'platform' | 'train' | 'car';
  stationId?: string;
  trainId?: string;
  carNumber?: number;
  carPosition?: 'front' | 'middle' | 'rear';
  coordinates?: [number, number];
  accuracy?: number;
}

class LocationService {
  private watchId: number | null = null;
  private lastKnownLocation: DeviceLocation | null = null;
  private locationCallbacks: Set<(location: DeviceLocation) => void> = new Set();
  private isWatching: boolean = false;
  private permissionStatus: 'unknown' | 'granted' | 'denied' = 'unknown';

  // Check if geolocation is supported
  isSupported(): boolean {
    return 'geolocation' in navigator && typeof navigator.geolocation !== 'undefined';
  }

  // Request location permission with better error handling
  async requestPermission(): Promise<boolean> {
    if (!this.isSupported()) {
      console.error('Geolocation is not supported by this browser');
      throw new Error('Geolocation is not supported by this browser');
    }

    try {
      // First check if we already have permission
      if ('permissions' in navigator) {
        try {
          const permission = await navigator.permissions.query({ name: 'geolocation' });
          console.log('Current geolocation permission state:', permission.state);
          
          if (permission.state === 'granted') {
            this.permissionStatus = 'granted';
            return true;
          } else if (permission.state === 'denied') {
            this.permissionStatus = 'denied';
            return false;
          }
        } catch (permError) {
          console.log('Permissions API not available, trying direct geolocation');
        }
      }

      // Test if we can get location (this will trigger permission prompt)
      console.log('Requesting geolocation permission...');
      await this.getCurrentPosition();
      this.permissionStatus = 'granted';
      console.log('Geolocation permission granted');
      return true;
    } catch (error) {
      console.error('Location permission denied or failed:', error);
      this.permissionStatus = 'denied';
      
      // Provide more specific error messages
      if (error instanceof GeolocationPositionError) {
        switch (error.code) {
          case error.PERMISSION_DENIED:
            throw new Error('Location access denied by user. Please enable location services in your browser settings.');
          case error.POSITION_UNAVAILABLE:
            throw new Error('Location information is unavailable. Please check your device\'s location settings.');
          case error.TIMEOUT:
            throw new Error('Location request timed out. Please try again.');
          default:
            throw new Error('An unknown error occurred while requesting location.');
        }
      }
      
      return false;
    }
  }

  // Get current position with improved error handling and timeout
  async getCurrentPosition(): Promise<DeviceLocation> {
    return new Promise((resolve, reject) => {
      if (!this.isSupported()) {
        reject(new Error('Geolocation not supported'));
        return;
      }

      console.log('Getting current position...');

      const options: PositionOptions = {
        enableHighAccuracy: true,
        timeout: 15000, // 15 seconds timeout
        maximumAge: 60000 // Accept cached position up to 1 minute old
      };

      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log('Position obtained:', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy
          });

          const location: DeviceLocation = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: new Date()
          };
          
          this.lastKnownLocation = location;
          resolve(location);
        },
        (error) => {
          console.error('Geolocation error:', error);
          
          let errorMessage = 'Location error: ';
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage += 'Permission denied. Please allow location access in your browser.';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage += 'Position unavailable. Please check your device location settings.';
              break;
            case error.TIMEOUT:
              errorMessage += 'Request timed out. Please try again.';
              break;
            default:
              errorMessage += 'Unknown error occurred.';
          }
          
          reject(new Error(errorMessage));
        },
        options
      );
    });
  }

  // Start watching location changes with better error handling
  startWatching(callback: (location: DeviceLocation) => void): void {
    if (!this.isSupported()) {
      throw new Error('Geolocation not supported');
    }

    if (this.permissionStatus !== 'granted') {
      throw new Error('Location permission not granted. Please request permission first.');
    }

    console.log('Starting location watching...');
    this.locationCallbacks.add(callback);

    if (this.watchId === null) {
      const options: PositionOptions = {
        enableHighAccuracy: true,
        timeout: 20000, // 20 seconds timeout for watch
        maximumAge: 30000 // Accept cached position up to 30 seconds old
      };

      this.watchId = navigator.geolocation.watchPosition(
        (position) => {
          console.log('Location update received:', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: new Date()
          });

          const location: DeviceLocation = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: new Date()
          };
          
          this.lastKnownLocation = location;
          this.isWatching = true;
          
          // Notify all callbacks
          this.locationCallbacks.forEach(cb => {
            try {
              cb(location);
            } catch (error) {
              console.error('Error in location callback:', error);
            }
          });
        },
        (error) => {
          console.error('Location watch error:', error);
          
          // Don't stop watching for temporary errors
          if (error.code === error.TIMEOUT) {
            console.log('Location timeout, continuing to watch...');
            return;
          }
          
          // For permission denied or position unavailable, stop watching
          if (error.code === error.PERMISSION_DENIED) {
            console.error('Permission denied during watch, stopping...');
            this.stopAllTracking();
            this.permissionStatus = 'denied';
          }
        },
        options
      );

      console.log('Location watching started with watch ID:', this.watchId);
    }
  }

  // Stop watching location for a specific callback
  stopWatching(callback?: (location: DeviceLocation) => void): void {
    if (callback) {
      this.locationCallbacks.delete(callback);
      console.log('Removed location callback, remaining callbacks:', this.locationCallbacks.size);
    }

    // If no callback specified, remove all callbacks (for cleanup)
    if (!callback) {
      this.locationCallbacks.clear();
      console.log('Cleared all location callbacks');
    }

    if (this.locationCallbacks.size === 0 && this.watchId !== null) {
      navigator.geolocation.clearWatch(this.watchId);
      this.watchId = null;
      this.isWatching = false;
      console.log('Location tracking stopped - all callbacks removed');
    }
  }

  // Force stop all location tracking (for cleanup)
  stopAllTracking(): void {
    console.log('Force stopping all location tracking...');
    this.locationCallbacks.clear();
    
    if (this.watchId !== null) {
      navigator.geolocation.clearWatch(this.watchId);
      this.watchId = null;
      this.isWatching = false;
      console.log('All location tracking forcefully stopped');
    }
  }

  // Check if currently watching location
  isCurrentlyWatching(): boolean {
    return this.isWatching && this.watchId !== null;
  }

  // Get permission status
  getPermissionStatus(): 'unknown' | 'granted' | 'denied' {
    return this.permissionStatus;
  }

  // Find nearest station based on coordinates with improved accuracy
  findNearestStation(latitude: number, longitude: number): Station | null {
    if (!MTA_STATIONS || MTA_STATIONS.length === 0) {
      console.warn('No MTA stations data available');
      return null;
    }

    console.log(`Finding nearest station to coordinates: ${latitude}, ${longitude}`);

    let nearestStation: Station | null = null;
    let minDistance = Infinity;

    for (const station of MTA_STATIONS) {
      if (!station.coordinates || station.coordinates.length !== 2) {
        continue;
      }

      const distance = this.calculateDistance(
        latitude,
        longitude,
        station.coordinates[0],
        station.coordinates[1]
      );

      console.log(`Distance to ${station.name}: ${distance.toFixed(3)}km`);

      if (distance < minDistance) {
        minDistance = distance;
        nearestStation = station;
      }
    }

    // Return the nearest station if within reasonable distance (2 km for NYC)
    if (nearestStation && minDistance <= 2.0) {
      console.log(`Found nearest station: ${nearestStation.name} (${minDistance.toFixed(2)}km away)`);
      return nearestStation;
    }

    console.log(`No nearby stations found. Closest was ${nearestStation?.name} at ${minDistance.toFixed(2)}km away`);
    return null;
  }

  // Calculate distance between two coordinates (in kilometers) using Haversine formula
  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.toRadians(lat2 - lat1);
    const dLon = this.toRadians(lon2 - lon1);
    
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(this.toRadians(lat1)) * Math.cos(this.toRadians(lat2)) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  // Detect if user is likely on a train (based on speed/movement patterns)
  async detectTrainMovement(): Promise<{
    isMoving: boolean;
    speed: number; // km/h
    confidence: number; // 0-1
  }> {
    if (!this.lastKnownLocation) {
      return { isMoving: false, speed: 0, confidence: 0 };
    }

    try {
      // Get a new position to compare
      const newPosition = await this.getCurrentPosition();
      const timeDiff = (newPosition.timestamp.getTime() - this.lastKnownLocation.timestamp.getTime()) / 1000; // seconds
      
      if (timeDiff < 5) {
        return { isMoving: false, speed: 0, confidence: 0.3 };
      }

      const distance = this.calculateDistance(
        this.lastKnownLocation.latitude,
        this.lastKnownLocation.longitude,
        newPosition.latitude,
        newPosition.longitude
      );

      const speed = (distance / timeDiff) * 3600; // km/h
      
      // Subway trains typically move 15-50 km/h in the city
      const isMoving = speed > 5; // Moving faster than walking
      const isTrainSpeed = speed >= 15 && speed <= 60;
      
      let confidence = 0.5;
      if (isTrainSpeed) confidence = 0.8;
      if (speed > 60) confidence = 0.3; // Might be in a car/bus
      if (speed < 5) confidence = 0.9; // Stationary/walking

      console.log(`Movement detection: speed=${speed.toFixed(1)}km/h, isMoving=${isMoving}, confidence=${confidence}`);

      return {
        isMoving,
        speed,
        confidence
      };
    } catch (error) {
      console.error('Error detecting movement:', error);
      return { isMoving: false, speed: 0, confidence: 0 };
    }
  }

  // Get last known location
  getLastKnownLocation(): DeviceLocation | null {
    return this.lastKnownLocation;
  }

  // Test location services (for debugging)
  async testLocationServices(): Promise<{
    supported: boolean;
    permission: string;
    position?: DeviceLocation;
    error?: string;
    browserInfo?: string;
  }> {
    const result: any = {
      supported: this.isSupported(),
      permission: this.permissionStatus,
      browserInfo: navigator.userAgent
    };

    if (!result.supported) {
      result.error = 'Geolocation not supported';
      return result;
    }

    try {
      console.log('Testing location services...');
      const position = await this.getCurrentPosition();
      result.position = position;
      result.permission = 'granted';
      console.log('Location test successful:', position);
    } catch (error) {
      result.error = error instanceof Error ? error.message : 'Unknown error';
      result.permission = 'denied';
      console.error('Location test failed:', error);
    }

    return result;
  }

  // Get mock location for testing (Brooklyn coordinates)
  getMockBrooklynLocation(): DeviceLocation {
    return {
      latitude: 40.6782,  // Brooklyn coordinates
      longitude: -73.9442,
      accuracy: 10,
      timestamp: new Date()
    };
  }

  // Get mock location for testing (Manhattan coordinates)
  getMockManhattanLocation(): DeviceLocation {
    return {
      latitude: 40.7580,  // Times Square coordinates
      longitude: -73.9855,
      accuracy: 10,
      timestamp: new Date()
    };
  }
}

export const locationService = new LocationService();