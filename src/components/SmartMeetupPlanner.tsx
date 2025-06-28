import React, { useState } from 'react';
import { MapPin, Users, Clock, Route, Zap, ArrowRight, Loader } from 'lucide-react';
import { Station } from '../types';
import { StationSelector } from './StationSelector';
import { meetupOptimizer } from '../services/meetupOptimizer';

interface SmartMeetupPlannerProps {
  onMeetupPlanCreated: (plan: {
    meetingStation: Station;
    person1Route: RouteInfo;
    person2Route: RouteInfo;
    estimatedMeetTime: Date;
  }) => void;
  onCancel: () => void;
}

interface RouteInfo {
  fromStation: Station;
  toStation: Station;
  estimatedTravelTime: number; // minutes
  suggestedLines: string[];
  transfers?: number;
}

export const SmartMeetupPlanner: React.FC<SmartMeetupPlannerProps> = ({
  onMeetupPlanCreated,
  onCancel
}) => {
  const [person1Station, setPerson1Station] = useState<Station>();
  const [person2Station, setPerson2Station] = useState<Station>();
  const [person1Name, setPerson1Name] = useState('');
  const [person2Name, setPerson2Name] = useState('');
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizationResult, setOptimizationResult] = useState<any>(null);
  const [error, setError] = useState<string>('');

  const canOptimize = person1Station && person2Station && person1Name.trim() && person2Name.trim();

  const handleOptimize = async () => {
    if (!person1Station || !person2Station || !person1Name.trim() || !person2Name.trim()) {
      return;
    }

    setIsOptimizing(true);
    setError('');
    setOptimizationResult(null);

    try {
      const result = await meetupOptimizer.findOptimalMeetingPoint(
        person1Station,
        person2Station,
        {
          person1Name: person1Name.trim(),
          person2Name: person2Name.trim(),
          preferredMeetTime: new Date(Date.now() + 30 * 60 * 1000), // 30 minutes from now
          maxTravelTime: 45, // max 45 minutes travel time
          avoidTransfers: false
        }
      );

      setOptimizationResult(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to optimize meetup location');
    } finally {
      setIsOptimizing(false);
    }
  };

  const handleCreateMeetup = () => {
    if (optimizationResult) {
      onMeetupPlanCreated({
        meetingStation: optimizationResult.meetingStation,
        person1Route: optimizationResult.person1Route,
        person2Route: optimizationResult.person2Route,
        estimatedMeetTime: optimizationResult.estimatedMeetTime
      });
    }
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
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="text-center">
        <div className="bg-gradient-to-r from-purple-100 to-blue-100 p-6 rounded-xl mb-6">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-purple-500 p-3 rounded-full">
              <Zap className="h-6 w-6 text-white" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Smart Meetup Planner</h2>
          <p className="text-gray-600">
            Let AI find the perfect meeting spot based on both of your starting locations
          </p>
        </div>
      </div>

      {!optimizationResult && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Person 1 */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center mb-4">
              <div className="bg-blue-100 p-2 rounded-full mr-3">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Person 1</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  value={person1Name}
                  onChange={(e) => setPerson1Name(e.target.value)}
                  placeholder="Enter name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Starting Station
                </label>
                <StationSelector
                  onStationSelect={setPerson1Station}
                  selectedStation={person1Station}
                />
              </div>
            </div>
          </div>

          {/* Person 2 */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center mb-4">
              <div className="bg-green-100 p-2 rounded-full mr-3">
                <Users className="h-5 w-5 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Person 2</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  value={person2Name}
                  onChange={(e) => setPerson2Name(e.target.value)}
                  placeholder="Enter name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Starting Station
                </label>
                <StationSelector
                  onStationSelect={setPerson2Station}
                  selectedStation={person2Station}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Optimization Button */}
      {!optimizationResult && (
        <div className="text-center">
          {canOptimize && (
            <button
              onClick={handleOptimize}
              disabled={isOptimizing}
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              {isOptimizing ? (
                <div className="flex items-center space-x-2">
                  <Loader className="h-5 w-5 animate-spin" />
                  <span>Finding optimal meeting point...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Zap className="h-5 w-5" />
                  <span>Find Best Meeting Spot</span>
                </div>
              )}
            </button>
          )}
          
          {error && (
            <div className="mt-4 p-4 bg-red-100 text-red-800 rounded-lg">
              {error}
            </div>
          )}
        </div>
      )}

      {/* Optimization Results */}
      {optimizationResult && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-xl border border-green-200">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-green-500 p-3 rounded-full">
                <MapPin className="h-6 w-6 text-white" />
              </div>
            </div>
            <h3 className="text-xl font-bold text-center text-gray-900 mb-2">
              Optimal Meeting Point Found!
            </h3>
            <div className="text-center">
              <h4 className="text-2xl font-bold text-green-700 mb-1">
                {optimizationResult.meetingStation.name}
              </h4>
              <p className="text-gray-600">{optimizationResult.meetingStation.borough}</p>
              <div className="flex justify-center space-x-1 mt-2">
                {optimizationResult.meetingStation.lines.map((line: string) => (
                  <span
                    key={line}
                    className={`${getLineColor(line)} text-white text-sm font-bold px-2 py-1 rounded-full min-w-[28px] text-center`}
                  >
                    {line}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Route Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Person 1 Route */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center mb-4">
                <div className="bg-blue-100 p-2 rounded-full mr-3">
                  <Route className="h-5 w-5 text-blue-600" />
                </div>
                <h4 className="font-semibold text-gray-900">{optimizationResult.person1Route.fromStation.name}</h4>
                <ArrowRight className="h-4 w-4 mx-2 text-gray-400" />
                <h4 className="font-semibold text-gray-900">{optimizationResult.meetingStation.name}</h4>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Travel Time:</span>
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span className="font-medium">{optimizationResult.person1Route.estimatedTravelTime} min</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Suggested Lines:</span>
                  <div className="flex space-x-1">
                    {optimizationResult.person1Route.suggestedLines.map((line: string) => (
                      <span
                        key={line}
                        className={`${getLineColor(line)} text-white text-xs font-bold px-2 py-1 rounded-full min-w-[24px] text-center`}
                      >
                        {line}
                      </span>
                    ))}
                  </div>
                </div>
                
                {optimizationResult.person1Route.transfers !== undefined && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Transfers:</span>
                    <span className="font-medium">{optimizationResult.person1Route.transfers}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Person 2 Route */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center mb-4">
                <div className="bg-green-100 p-2 rounded-full mr-3">
                  <Route className="h-5 w-5 text-green-600" />
                </div>
                <h4 className="font-semibold text-gray-900">{optimizationResult.person2Route.fromStation.name}</h4>
                <ArrowRight className="h-4 w-4 mx-2 text-gray-400" />
                <h4 className="font-semibold text-gray-900">{optimizationResult.meetingStation.name}</h4>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Travel Time:</span>
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span className="font-medium">{optimizationResult.person2Route.estimatedTravelTime} min</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Suggested Lines:</span>
                  <div className="flex space-x-1">
                    {optimizationResult.person2Route.suggestedLines.map((line: string) => (
                      <span
                        key={line}
                        className={`${getLineColor(line)} text-white text-xs font-bold px-2 py-1 rounded-full min-w-[24px] text-center`}
                      >
                        {line}
                      </span>
                    ))}
                  </div>
                </div>
                
                {optimizationResult.person2Route.transfers !== undefined && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Transfers:</span>
                    <span className="font-medium">{optimizationResult.person2Route.transfers}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Meeting Time */}
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <div className="flex items-center justify-center space-x-2">
              <Clock className="h-5 w-5 text-blue-600" />
              <span className="font-medium text-gray-900">
                Estimated Meeting Time: {optimizationResult.estimatedMeetTime.toLocaleTimeString('en-US', { 
                  hour: 'numeric', 
                  minute: '2-digit',
                  hour12: true 
                })}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4 justify-center">
            <button
              onClick={handleCreateMeetup}
              className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Create Meetup at This Location
            </button>
            <button
              onClick={() => {
                setOptimizationResult(null);
                setError('');
              }}
              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Try Different Locations
            </button>
          </div>
        </div>
      )}

      {/* Cancel Button */}
      <div className="text-center">
        <button
          onClick={onCancel}
          className="px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors"
        >
          Back to Main Menu
        </button>
      </div>
    </div>
  );
};