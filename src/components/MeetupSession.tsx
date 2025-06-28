import React, { useState } from 'react';
import { Users, Copy, Share, QrCode, Clock, MapPin, Train } from 'lucide-react';
import { MeetupSession as MeetupSessionType, Participant } from '../types';
import { LocationUpdater } from './LocationUpdater';
import { LocationTracker } from './LocationTracker';

interface MeetupSessionProps {
  session: MeetupSessionType;
  currentUserId: string;
  onLeaveSession: () => void;
  onUpdateLocation: (participantId: string, location: Participant['location']) => void;
}

export const MeetupSession: React.FC<MeetupSessionProps> = ({
  session,
  currentUserId,
  onLeaveSession,
  onUpdateLocation
}) => {
  const [showShareModal, setShowShareModal] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  const currentUser = session.participants.find(p => p.id === currentUserId);
  const otherParticipants = session.participants.filter(p => p.id !== currentUserId);

  const getTimeSinceUpdate = (lastUpdated: Date): string => {
    const now = new Date();
    const diffMs = now.getTime() - lastUpdated.getTime();
    const diffSeconds = Math.floor(diffMs / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMinutes / 60);
    
    if (diffHours > 0) {
      return `${diffHours}h ago`;
    } else if (diffMinutes > 0) {
      return `${diffMinutes}m ago`;
    } else if (diffSeconds > 5) {
      return `${diffSeconds}s ago`;
    } else {
      return 'just now';
    }
  };

  const handleLocationUpdate = (location: Participant['location']) => {
    onUpdateLocation(currentUserId, location);
  };

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(session.code);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  const shareSession = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Join my MTA Meetup',
          text: `Join me on the subway! Use code: ${session.code}`,
          url: window.location.href
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      setShowShareModal(true);
    }
  };

  const getStatusColor = (status: Participant['status']) => {
    switch (status) {
      case 'waiting': return 'bg-yellow-100 text-yellow-800';
      case 'boarding': return 'bg-blue-100 text-blue-800';
      case 'on_train': return 'bg-green-100 text-green-800';
      case 'found': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getLocationText = (participant: Participant) => {
    const { location } = participant;
    if (location.type === 'platform') {
      return `Platform at ${session.station.name}`;
    }
    if (location.type === 'train' && location.trainId) {
      return `On train ${location.trainId}`;
    }
    if (location.type === 'car' && location.carNumber) {
      return `Car ${location.carNumber} - ${location.position}`;
    }
    return 'Location updating...';
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-semibold text-gray-900 flex items-center">
            <Users className="h-5 w-5 mr-2 text-blue-600" />
            Meetup Session
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            {session.participants.length} participant{session.participants.length !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={copyCode}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Copy className="h-4 w-4" />
            <span className="font-mono font-bold">{session.code}</span>
          </button>
          <button
            onClick={shareSession}
            className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <Share className="h-4 w-4" />
          </button>
        </div>
      </div>

      {copiedCode && (
        <div className="mb-4 p-3 bg-green-100 text-green-800 rounded-lg text-sm">
          Code copied to clipboard!
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-2 flex items-center">
            <MapPin className="h-4 w-4 mr-2" />
            Station
          </h4>
          <p className="text-gray-700">{session.station.name}</p>
          <p className="text-sm text-gray-600">{session.station.borough}</p>
        </div>

        {session.train && (
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2 flex items-center">
              <Train className="h-4 w-4 mr-2" />
              Train
            </h4>
            <p className="text-gray-700">{session.train.line} Train</p>
            <p className="text-sm text-gray-600 capitalize">{session.train.direction}</p>
          </div>
        )}
      </div>

      {currentUser && session.train && (
        <div className="mb-6 space-y-4">
          <LocationTracker
            onLocationUpdate={(location) => {
              onUpdateLocation(currentUserId, {
                type: location.type,
                station: location.stationId,
                trainId: location.trainId,
                carNumber: location.carNumber,
                position: location.carPosition as any
              });
            }}
            currentStation={session.station}
            availableTrains={session.train ? [session.train] : []}
          />
          
          <LocationUpdater
            participant={currentUser}
            onLocationUpdate={handleLocationUpdate}
            maxCars={session.train.cars}
            trainLine={session.train.line}
          />
        </div>
      )}

      <div className="space-y-4">
        <h4 className="font-medium text-gray-900">Participants</h4>
        
        {currentUser && (
          <div className="p-4 border-2 border-blue-200 bg-blue-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">{currentUser.name} (You)</p>
                <p className="text-sm text-gray-600">{getLocationText(currentUser)}</p>
              </div>
              <div className="flex items-center space-x-3">
                <div className={`px-3 py-1 rounded-full text-sm ${getStatusColor(currentUser.status)}`}>
                  {currentUser.status.replace('_', ' ')}
                </div>
              </div>
            </div>
          </div>
        )}

        {otherParticipants.map(participant => (
          <div key={participant.id} className="p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">{participant.name}</p>
                <p className="text-sm text-gray-600">{getLocationText(participant)}</p>
              </div>
              <div className="flex items-center space-x-3">
                <div className={`px-3 py-1 rounded-full text-sm ${getStatusColor(participant.status)}`}>
                  {participant.status.replace('_', ' ')}
                </div>
                <div className="text-xs text-gray-500 flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  {getTimeSinceUpdate(participant.lastUpdated)}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Current User Location Update Time */}
      {currentUser && (
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Your last location update:</span>
            <div className="flex items-center text-gray-500">
              <Clock className="h-3 w-3 mr-1" />
              {getTimeSinceUpdate(currentUser.lastUpdated)}
            </div>
          </div>
        </div>
      )}

      <div className="mt-6 pt-6 border-t border-gray-200">
        <button
          onClick={onLeaveSession}
          className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Leave Session
        </button>
      </div>

      {showShareModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full">
            <h4 className="text-lg font-semibold mb-4">Share Meetup</h4>
            <div className="space-y-4">
              <div className="p-3 bg-gray-100 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">Meetup Code:</p>
                <p className="font-mono text-lg font-bold">{session.code}</p>
              </div>
              <div className="flex items-center justify-center">
                <QrCode className="h-24 w-24 text-gray-400" />
              </div>
              <button
                onClick={() => setShowShareModal(false)}
                className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};