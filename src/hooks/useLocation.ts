import { useState, useEffect, useCallback } from 'react';
import { locationService, DeviceLocation } from '../services/locationService';
import { Station } from '../types';

export const useLocation = () => {
  const [deviceLocation, setDeviceLocation] = useState<DeviceLocation | null>(null);
  const [isTracking, setIsTracking] = useState(false);
  const [permission, setPermission] = useState<'unknown' | 'granted' | 'denied'>('unknown');
  const [nearestStation, setNearestStation] = useState<Station | null>(null);
  const [error, setError] = useState<string | null>(null);

  const requestPermission = useCallback(async () => {
    try {
      setError(null);
      const granted = await locationService.requestPermission();
      setPermission(granted ? 'granted' : 'denied');
      return granted;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Location permission failed');
      setPermission('denied');
      return false;
    }
  }, []);

  const startTracking = useCallback(() => {
    if (permission !== 'granted') {
      setError('Location permission not granted');
      return;
    }

    try {
      setIsTracking(true);
      setError(null);
      
      locationService.startWatching((location) => {
        setDeviceLocation(location);
        
        // Find nearest station
        const nearest = locationService.findNearestStation(
          location.latitude,
          location.longitude
        );
        setNearestStation(nearest);
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start location tracking');
      setIsTracking(false);
    }
  }, [permission]);

  const stopTracking = useCallback(() => {
    setIsTracking(false);
    locationService.stopWatching();
  }, []);

  const getCurrentLocation = useCallback(async () => {
    try {
      setError(null);
      const location = await locationService.getCurrentPosition();
      setDeviceLocation(location);
      
      const nearest = locationService.findNearestStation(
        location.latitude,
        location.longitude
      );
      setNearestStation(nearest);
      
      return location;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get current location');
      throw err;
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (isTracking) {
        locationService.stopWatching();
      }
    };
  }, [isTracking]);

  return {
    deviceLocation,
    nearestStation,
    isTracking,
    permission,
    error,
    isSupported: locationService.isSupported(),
    requestPermission,
    startTracking,
    stopTracking,
    getCurrentLocation
  };
};