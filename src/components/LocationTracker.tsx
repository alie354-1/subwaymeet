import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, Train, AlertCircle, CheckCircle, Loader, Clock, Power, PowerOff, RefreshCw } from 'lucide-react';
import { locationService, DeviceLocation } from '../services/locationService';
import { Station, Train as TrainType } from '../types';

interface LocationTrackerProps {
  onLocationUpdate: (location: {
    type: 'platform' | 'train' | 'car';
    stationId?: string;
    trainId?: string;
    carNumber?: number;
    carPosition?: 'front' | 'middle' | 'rear';
    coordinates?: [number, number];
    accuracy?: number;
  }) => void;
  currentStation?: Station;
  availableTrains?: TrainType[];
}

export const LocationTracker: React.FC<LocationTrackerProps> = ({
  onLocationUpdate,
  currentStation,
  availableTrains = []
}) => {
  const [deviceLocation, setDeviceLocation] = useState<DeviceLocation | null>(null);
  const [locationPermission, setLocationPermission] = useState<'unknown' | 'granted' | 'denied'>('unknown');
  const [isTracking, setIsTracking] = useState(false);
  const [nearestStation, setNearestStation] = useState<Station | null>(null);
  const [movementData, setMovementData] = useState<{
    isMoving: boolean;
    speed: number;
    confidence: number;
  } | null>(null);
  const [confirmedTrain, setConfirmedTrain] = useState<TrainType | null>(null);
  const [showTrainConfirmation, setShowTrainConfirmation] = useState(false);
  const [lastUpdateTime, setLastUpdateTime] = useState<Date | null>(null);
  const [timeSinceUpdate, setTimeSinceUpdate] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isRequestingPermission, setIsRequestingPermission] = useState(false);
  const [debugInfo, setDebugInfo] = useState<any>(null);

  // Test location services on component mount
  useEffect(() => {
    const testServices = async () => {
      try {
        const test = await locationService.testLocationServices();
        setDebugInfo(test);
        console.log('Location services test:', test);
        
        if (test.permission === 'granted') {
          setLocationPermission('granted');
        } else if (test.permission === 'denied') {
          setLocationPermission('denied');
        }
      } catch (error) {
        console.error('Error testing location services:', error);
      }
    };

    testServices();
  }, []);

  // Request location permission
  const requestLocation = async () => {
    setIsRequestingPermission(true);
    setError('');
    
    try {
      console.log('Requesting location permission...');
      const granted = await locationService.requestPermission();
      setLocationPermission(granted ? 'granted' : 'denied');
      
      if (granted) {
        console.log('Permission granted, starting tracking...');
        await startTracking();
      } else {
        setError('Location permission was denied. Please enable location services in your browser settings.');
      }
    } catch (error) {
      console.error('Location permission error:', error);
      setLocationPermission('denied');
      setError(error instanceof Error ? error.message : 'Failed to request location permission');
    } finally {
      setIsRequestingPermission(false);
    }
  };

  // Start location tracking
  const startTracking = async () => {
    if (!locationService.isSupported()) {
      setError('Location services are not supported by your device or browser');
      return;
    }

    if (locationPermission !== 'granted') {
      setError('Location permission not granted');
      return;
    }

    try {
      setError('');
      setIsTracking(true);
      
      console.log('Starting location tracking...');
      
      // Get initial position
      try {
        const initialPosition = await locationService.getCurrentPosition();
        console.log('Got initial position:', initialPosition);
        handleLocationUpdate(initialPosition);
      } catch (error) {
        console.warn('Could not get initial position:', error);
      }
      
      // Start watching for updates
      locationService.startWatching((location) => {
        console.log('Location update received in component:', location);
        handleLocationUpdate(location);
      });

      // Check for train movement every 30 seconds
      const movementInterval = setInterval(async () => {
        try {
          const movement = await locationService.detectTrainMovement();
          setMovementData(movement);
          
          // If moving fast and we have available trains, suggest train confirmation
          if (movement.isMoving && movement.speed > 15 && movement.confidence > 0.7 && !confirmedTrain && availableTrains.length > 0) {
            setShowTrainConfirmation(true);
          }
        } catch (error) {
          console.error('Movement detection error:', error);
        }
      }, 30000);

      return () => {
        clearInterval(movementInterval);
      };
    } catch (error) {
      console.error('Error starting location tracking:', error);
      setError(error instanceof Error ? error.message : 'Failed to start location tracking');
      setIsTracking(false);
    }
  };

  // Handle location updates
  const handleLocationUpdate = (location: DeviceLocation) => {
    setDeviceLocation(location);
    setLastUpdateTime(new Date());
    
    // Find nearest station
    const nearest = locationService.findNearestStation(location.latitude, location.longitude);
    setNearestStation(nearest);
    
    // Update location in the session
    onLocationUpdate({
      type: confirmedTrain ? 'train' : 'platform',
      stationId: nearest?.id || currentStation?.id,
      trainId: confirmedTrain?.id,
      coordinates: [location.latitude, location.longitude],
      accuracy: location.accuracy
    });
  };

  // Stop tracking
  const stopTracking = () => {
    console.log('Stopping location tracking...');
    setIsTracking(false);
    setLastUpdateTime(null);
    setError('');
    locationService.stopWatching();
  };

  // Confirm which train the user is on
  const confirmTrain = (train: TrainType) => {
    setConfirmedTrain(train);
    setShowTrainConfirmation(false);
    
    onLocationUpdate({
      type: 'train',
      stationId: nearestStation?.id || currentStation?.id,
      trainId: train.id,
      coordinates: deviceLocation ? [deviceLocation.latitude, deviceLocation.longitude] : undefined,
      accuracy: deviceLocation?.accuracy
    });
    
    setLastUpdateTime(new Date());
  };

  // Clear train confirmation
  const clearTrainConfirmation = () => {
    setConfirmedTrain(null);
    
    onLocationUpdate({
      type: 'platform',
      stationId: nearestStation?.id || currentStation?.id,
      coordinates: deviceLocation ? [deviceLocation.latitude, deviceLocation.longitude] : undefined,
      accuracy: deviceLocation?.accuracy
    });
    
    setLastUpdateTime(new Date());
  };

  // Update time since last update
  useEffect(() => {
    if (!lastUpdateTime) return;
    
    const updateTimer = () => {
      const now = new Date();
      const diffMs = now.getTime() - lastUpdateTime.getTime();
      const diffSeconds = Math.floor(diffMs / 1000);
      const diffMinutes = Math.floor(diffSeconds / 60);
      
      if (diffMinutes > 0) {
        setTimeSinceUpdate(`${diffMinutes}m ago`);
      } else if (diffSeconds > 0) {
        setTimeSinceUpdate(`${diffSeconds}s ago`);
      } else {
        setTimeSinceUpdate('just now');
      }
    };
    
    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    
    return () => clearInterval(interval);
  }, [lastUpdateTime]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (isTracking) {
        locationService.stopWatching();
      }
    };
  }, [isTracking]);

  const getAccuracyColor = (accuracy: number) => {
    if (accuracy <= 10) return 'text-green-600 bg-green-100';
    if (accuracy <= 50) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getLineColor = (line: string) => {
    const colors: { [key: string]: string } = {
      'N': 'bg-yellow-500', 'Q': 'bg-yellow-500', 'R': 'bg-yellow-500', 'W': 'bg-yellow-500',
      '1': 'bg-red-500', '2': 'bg-red-500', '3': 'bg-red-500',
      '4': 'bg-green-500', '5': 'bg-green-500', '6': 'bg-green-500',
      '7': 'bg-purple-500', 'B': 'bg-orange-500', 'D': 'bg-orange-500', 'F': 'bg-orange-500', 'M': 'bg-orange-500',
      'A': 'bg-blue-600', 'C': 'bg-blue-600', 'E': 'bg-blue-600',
      'G': 'bg-lime-500', 'J': 'bg-amber-600', 'Z': 'bg-amber-600',
      'L': 'bg-gray-500', 'S': 'bg-gray-600', 'SIR': 'bg-blue-800'
    };
    return colors[line] || 'bg-blue-500';
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-medium text-gray-900 flex items-center">
          <Navigation className="h-4 w-4 mr-2 text-blue-600" />
          Real-time Location {lastUpdateTime && (
            <span className="ml-2 text-xs text-gray-500 flex items-center">
              <Clock className="h-3 w-3 mr-1" />
              {timeSinceUpdate}
            </span>
          )}
        </h4>
        
        <div className="flex items-center space-x-2">
          {locationPermission === 'unknown' && (
            <button
              onClick={requestLocation}
              disabled={isRequestingPermission}
              className="flex items-center space-x-2 px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm disabled:opacity-50"
            >
              {isRequestingPermission ? (
                <Loader className="h-3 w-3 animate-spin" />
              ) : (
                <MapPin className="h-3 w-3" />
              )}
              <span>{isRequestingPermission ? 'Requesting...' : 'Enable Location'}</span>
            </button>
          )}
          
          {locationPermission === 'granted' && !isTracking && (
            <button
              onClick={startTracking}
              className="flex items-center space-x-2 px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
            >
              <Power className="h-3 w-3" />
              <span>Start Tracking</span>
            </button>
          )}
          
          {isTracking && (
            <button
              onClick={stopTracking}
              className="flex items-center space-x-2 px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
            >
              <PowerOff className="h-3 w-3" />
              <span>Stop Tracking</span>
            </button>
          )}

          {/* Debug button for troubleshooting */}
          {process.env.NODE_ENV === 'development' && (
            <button
              onClick={async () => {
                const test = await locationService.testLocationServices();
                setDebugInfo(test);
                console.log('Location test:', test);
              }}
              className="flex items-center space-x-1 px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs hover:bg-gray-200"
            >
              <RefreshCw className="h-3 w-3" />
              <span>Test</span>
            </button>
          )}
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-800 rounded-lg text-sm">
          <AlertCircle className="h-4 w-4 inline mr-2" />
          {error}
        </div>
      )}

      {/* User Choice Notice */}
      {locationPermission === 'unknown' && (
        <div className="mb-4 p-3 bg-blue-50 rounded-lg border-l-4 border-blue-500">
          <h5 className="font-medium text-blue-900 mb-1">Optional: Enable Real-time Location</h5>
          <p className="text-sm text-blue-800 mb-2">
            Share your live location with friends to make meetups easier. You can start and stop tracking anytime.
          </p>
          <ul className="text-xs text-blue-700 space-y-1">
            <li>• Automatically detect when you board trains</li>
            <li>• Help friends find you with precise GPS coordinates</li>
            <li>• Stop sharing anytime with one click</li>
          </ul>
        </div>
      )}

      {locationPermission === 'denied' && (
        <div className="p-3 bg-red-100 text-red-800 rounded-lg text-sm mb-4">
          <AlertCircle className="h-4 w-4 inline mr-2" />
          Location access denied. To enable:
          <ul className="mt-2 text-xs space-y-1">
            <li>• Click the location icon in your browser's address bar</li>
            <li>• Select "Allow" for location access</li>
            <li>• Refresh the page and try again</li>
          </ul>
        </div>
      )}

      {isTracking && deviceLocation && (
        <div className="space-y-3">
          {/* Current Location Status */}
          <div className="p-3 bg-blue-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <span className="font-medium text-gray-900">Current Location</span>
                <div className="flex items-center text-green-600">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-1"></div>
                  <span className="text-xs">Live</span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className={`px-2 py-1 rounded text-xs ${getAccuracyColor(deviceLocation.accuracy)}`}>
                  ±{Math.round(deviceLocation.accuracy)}m
                </div>
              </div>
            </div>
            
            {nearestStation ? (
              <div>
                <p className="text-sm text-gray-700">
                  <MapPin className="h-3 w-3 inline mr-1" />
                  Near {nearestStation.name}
                </p>
                <p className="text-xs text-gray-600">{nearestStation.borough}</p>
              </div>
            ) : (
              <p className="text-sm text-gray-600">
                <MapPin className="h-3 w-3 inline mr-1" />
                Location detected, finding nearest station...
              </p>
            )}
          </div>

          {/* Movement Detection */}
          {movementData && (
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-900">Movement Detection</span>
                <div className="flex items-center space-x-2">
                  {movementData.isMoving ? (
                    <div className="flex items-center text-green-600">
                      <Train className="h-3 w-3 mr-1" />
                      <span className="text-xs">Moving ({Math.round(movementData.speed)} km/h)</span>
                    </div>
                  ) : (
                    <div className="flex items-center text-gray-600">
                      <MapPin className="h-3 w-3 mr-1" />
                      <span className="text-xs">Stationary</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="mt-1">
                <div className="w-full bg-gray-200 rounded-full h-1">
                  <div 
                    className="bg-blue-500 h-1 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(movementData.confidence * 100, 100)}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-600 mt-1">
                  Confidence: {Math.round(movementData.confidence * 100)}%
                </p>
              </div>
            </div>
          )}

          {/* Train Confirmation */}
          {confirmedTrain ? (
            <div className="p-3 bg-green-50 rounded-lg border-l-4 border-green-500">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <div className={`${getLineColor(confirmedTrain.line)} text-white text-sm font-bold px-2 py-1 rounded-full min-w-[28px] text-center`}>
                    {confirmedTrain.line}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">On {confirmedTrain.line} Train</p>
                    <p className="text-xs text-gray-600 capitalize">{confirmedTrain.direction}</p>
                  </div>
                </div>
                <button
                  onClick={clearTrainConfirmation}
                  className="text-xs text-gray-600 hover:text-gray-800 underline"
                >
                  Clear
                </button>
              </div>
            </div>
          ) : (
            <div className="p-3 bg-yellow-50 rounded-lg">
              <p className="text-sm text-gray-700">
                <MapPin className="h-3 w-3 inline mr-1 text-yellow-600" />
                On platform - we'll detect when you board a train
              </p>
            </div>
          )}
          
          {/* Privacy Notice */}
          <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex items-start space-x-2">
              <AlertCircle className="h-4 w-4 text-gray-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs text-gray-600">
                  <strong>Privacy:</strong> Your location is only shared with participants in this meetup session. 
                  Location tracking stops automatically when you leave the session.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Debug Info (development only) */}
      {process.env.NODE_ENV === 'development' && debugInfo && (
        <div className="mt-4 p-3 bg-gray-100 rounded-lg">
          <h5 className="text-xs font-medium text-gray-700 mb-2">Debug Info:</h5>
          <pre className="text-xs text-gray-600 overflow-auto">
            {JSON.stringify(debugInfo, null, 2)}
          </pre>
        </div>
      )}

      {/* Train Confirmation Modal */}
      {showTrainConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full">
            <div className="text-center mb-4">
              <Train className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <h4 className="text-lg font-semibold text-gray-900">Are you on a train?</h4>
              <p className="text-sm text-gray-600 mt-1">
                We detected you're moving. Which train are you on?
              </p>
            </div>
            
            <div className="space-y-2 mb-4">
              {availableTrains.slice(0, 4).map(train => (
                <button
                  key={train.id}
                  onClick={() => confirmTrain(train)}
                  className="w-full flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
                >
                  <div className={`${getLineColor(train.line)} text-white text-sm font-bold px-2 py-1 rounded-full min-w-[28px] text-center`}>
                    {train.line}
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-gray-900">{train.line} Train</p>
                    <p className="text-xs text-gray-600 capitalize">{train.direction}</p>
                  </div>
                </button>
              ))}
            </div>
            
            <button
              onClick={() => setShowTrainConfirmation(false)}
              className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Not on a train
            </button>
          </div>
        </div>
      )}

      {!locationService.isSupported() && (
        <div className="p-3 bg-yellow-100 text-yellow-800 rounded-lg text-sm">
          <AlertCircle className="h-4 w-4 inline mr-2" />
          Location services are not supported by your browser or device.
        </div>
      )}
    </div>
  );
};