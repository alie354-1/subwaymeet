import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { StationSelector } from './components/StationSelector';
import { TrainSelector } from './components/TrainSelector';
import { CarSelector } from './components/CarSelector';
import { MeetupSession } from './components/MeetupSession';
import { JoinSession } from './components/JoinSession';
import { SmartMeetupPlanner } from './components/SmartMeetupPlanner';
import { locationService } from './services/locationService';
import { Station, Train, MeetupSession as MeetupSessionType, Participant } from './types';
import { Plus, Users, Zap } from 'lucide-react';

type AppState = 'home' | 'create' | 'join' | 'session' | 'smart-planner';

function App() {
  const [currentState, setCurrentState] = useState<AppState>('home');
  const [selectedStation, setSelectedStation] = useState<Station>();
  const [selectedTrain, setSelectedTrain] = useState<Train>();
  const [selectedCar, setSelectedCar] = useState<{ number: number; position: 'front' | 'middle' | 'rear' }>();
  const [currentSession, setCurrentSession] = useState<MeetupSessionType>();
  const [currentUserId] = useState('user-123'); // Mock user ID

  const generateSessionCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  const handleCreateSession = () => {
    if (!selectedStation || !selectedTrain || !selectedCar) return;

    const newSession: MeetupSessionType = {
      id: 'session-' + Date.now(),
      code: generateSessionCode(),
      createdBy: currentUserId,
      createdAt: new Date(),
      station: selectedStation,
      train: selectedTrain,
      participants: [
        {
          id: currentUserId,
          name: 'You',
          location: {
            type: 'car',
            station: selectedStation.id,
            trainId: selectedTrain.id,
            carNumber: selectedCar.number,
            position: selectedCar.position
          },
          status: 'on_train',
          lastUpdated: new Date()
        }
      ],
      status: 'in_transit'
    };

    setCurrentSession(newSession);
    setCurrentState('session');
  };

  const handleJoinSession = (code: string, userName: string) => {
    // Mock joining a session
    const mockSession: MeetupSessionType = {
      id: 'session-' + Date.now(),
      code: code,
      createdBy: 'other-user',
      createdAt: new Date(Date.now() - 5 * 60 * 1000),
      station: selectedStation || {
        id: 'times-sq',
        name: 'Times Square-42nd Street',
        borough: 'Manhattan',
        lines: ['N', 'Q', 'R', 'W'],
        coordinates: [40.7580, -73.9855]
      },
      participants: [
        {
          id: 'other-user',
          name: 'Alex',
          location: {
            type: 'car',
            carNumber: 3,
            position: 'middle'
          },
          status: 'on_train',
          lastUpdated: new Date(Date.now() - 2 * 60 * 1000)
        },
        {
          id: currentUserId,
          name: userName,
          location: {
            type: 'platform'
          },
          status: 'waiting',
          lastUpdated: new Date()
        }
      ],
      status: 'in_transit'
    };

    setCurrentSession(mockSession);
    setCurrentState('session');
  };

  const handleLeaveSession = () => {
    // Stop all location tracking when leaving session
    locationService.stopAllTracking();
    
    setCurrentSession(undefined);
    setCurrentState('home');
    setSelectedStation(undefined);
    setSelectedTrain(undefined);
    setSelectedCar(undefined);
  };

  const handleUpdateLocation = (participantId: string, location: Participant['location']) => {
    if (!currentSession) return;

    const updatedSession = {
      ...currentSession,
      participants: currentSession.participants.map(participant =>
        participant.id === participantId
          ? {
              ...participant,
              location,
              lastUpdated: new Date(),
              status: location.type === 'car' ? 'on_train' : 
                     location.type === 'train' ? 'boarding' : 'waiting'
            }
          : participant
      )
    };

    setCurrentSession(updatedSession);
  };

  const handleSmartMeetupPlan = (plan: any) => {
    // Create a session at the optimized meeting point
    const newSession: MeetupSessionType = {
      id: 'session-' + Date.now(),
      code: generateSessionCode(),
      createdBy: currentUserId,
      createdAt: new Date(),
      station: plan.meetingStation,
      participants: [
        {
          id: currentUserId,
          name: 'You',
          location: {
            type: 'platform',
            station: plan.meetingStation.id
          },
          status: 'waiting',
          lastUpdated: new Date()
        }
      ],
      status: 'waiting'
    };

    setCurrentSession(newSession);
    setCurrentState('session');
  };
  const canCreateSession = selectedStation && selectedTrain && selectedCar;

  // Cleanup location tracking on app unmount
  React.useEffect(() => {
    return () => {
      locationService.stopAllTracking();
    };
  }, []);

  return (
    <Layout onLogoClick={() => setCurrentState('home')}>
      {currentState === 'home' && (
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Find Friends on the Subway
            </h1>
            <p className="text-xl text-gray-600">
              Coordinate meetups and navigate NYC transit together in real-time
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <button
              onClick={() => setCurrentState('create')}
              className="p-8 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow border-2 border-transparent hover:border-blue-200"
            >
              <div className="text-center">
                <div className="bg-blue-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Plus className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Create Meetup</h3>
                <p className="text-gray-600">
                  Start a new meetup session and share your location with friends
                </p>
              </div>
            </button>

            <button
              onClick={() => setCurrentState('join')}
              className="p-8 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow border-2 border-transparent hover:border-blue-200"
            >
              <div className="text-center">
                <div className="bg-green-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Users className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Join Meetup</h3>
                <p className="text-gray-600">
                  Enter a code to join an existing meetup session
                </p>
              </div>
            </button>

            <button
              onClick={() => setCurrentState('smart-planner')}
              className="p-8 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl shadow-lg hover:shadow-xl transition-all border-2 border-transparent hover:border-purple-200"
            >
              <div className="text-center">
                <div className="bg-gradient-to-r from-purple-500 to-blue-500 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Zap className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Smart Meetup Planner</h3>
                <p className="text-gray-600">
                  Let AI find the perfect meeting spot based on both of your starting locations
                </p>
                <div className="mt-3 inline-flex items-center px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                  <Zap className="h-3 w-3 mr-1" />
                  AI-Powered
                </div>
              </div>
            </button>
          </div>
          
          <div className="mt-8 p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
            <p className="text-sm text-green-800">
              <strong>✓ Live MTA Data:</strong> This app now uses real-time MTA subway feeds for accurate train information and arrival times.
            </p>
          </div>
        </div>
      )}

      {currentState === 'create' && (
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Create New Meetup</h2>
            <button
              onClick={() => setCurrentState('home')}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Cancel
            </button>
          </div>

          {/* Create Button - Prominent when ready */}
          {canCreateSession && (
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-xl shadow-lg border border-blue-200">
              <div className="flex items-center justify-between">
                <div className="text-white">
                  <h3 className="text-xl font-bold mb-2">Ready to Create Your Meetup!</h3>
                  <p className="text-blue-100">
                    You'll be in Car {selectedCar.number} ({selectedCar.position}) of the {selectedTrain.line} train at {selectedStation.name}
                  </p>
                </div>
                <button
                  onClick={handleCreateSession}
                  className="px-8 py-4 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-bold text-lg shadow-md hover:shadow-lg transform hover:scale-105"
                >
                  Create Meetup
                </button>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <StationSelector
                onStationSelect={setSelectedStation}
                selectedStation={selectedStation}
              />
              
              {selectedStation && (
                <TrainSelector
                  station={selectedStation}
                  onTrainSelect={setSelectedTrain}
                  selectedTrain={selectedTrain}
                />
              )}
            </div>

            <div>
              {selectedTrain && (
                <CarSelector
                  train={selectedTrain}
                  onCarSelect={(number, position) => setSelectedCar({ number, position })}
                  selectedCar={selectedCar}
                />
              )}
            </div>
          </div>
        </div>
      )}

      {currentState === 'join' && (
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Join Meetup</h2>
            <button
              onClick={() => setCurrentState('home')}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Cancel
            </button>
          </div>

          <JoinSession onJoinSession={handleJoinSession} />
        </div>
      )}

      {currentState === 'smart-planner' && (
        <SmartMeetupPlanner
          onMeetupPlanCreated={handleSmartMeetupPlan}
          onCancel={() => setCurrentState('home')}
        />
      )}
      {currentState === 'session' && currentSession && (
        <div className="max-w-4xl mx-auto">
          <MeetupSession
            session={currentSession}
            currentUserId={currentUserId}
            onLeaveSession={handleLeaveSession}
            onUpdateLocation={handleUpdateLocation}
          />
        </div>
      )}
    </Layout>
  );
}

export default App;