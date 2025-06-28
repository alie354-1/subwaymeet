import React, { useState } from 'react';
import { MapPin, Train, Check, Edit3, Users } from 'lucide-react';
import { Participant } from '../types';

interface LocationUpdaterProps {
  participant: Participant;
  onLocationUpdate: (location: Participant['location']) => void;
  maxCars: number;
  trainLine: string;
}

export const LocationUpdater: React.FC<LocationUpdaterProps> = ({
  participant,
  onLocationUpdate,
  maxCars,
  trainLine
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [selectedCar, setSelectedCar] = useState(participant.location.carNumber || 1);
  const [selectedPosition, setSelectedPosition] = useState<'front' | 'middle' | 'rear'>(
    participant.location.position || 'middle'
  );
  const [crowdingLevel, setCrowdingLevel] = useState<'light' | 'moderate' | 'crowded'>(
    (participant.location as any).crowdingLevel || 'moderate'
  );

  const cars = Array.from({ length: maxCars }, (_, i) => i + 1);
  const positions: Array<{ id: 'front' | 'middle' | 'rear'; label: string; description: string }> = [
    { id: 'front', label: 'Front', description: 'Near the conductor' },
    { id: 'middle', label: 'Middle', description: 'Center of the car' },
    { id: 'rear', label: 'Rear', description: 'Back of the car' }
  ];

  const crowdingOptions: Array<{ id: 'light' | 'moderate' | 'crowded'; label: string; description: string; color: string }> = [
    { id: 'light', label: 'Light', description: 'Plenty of seats available', color: 'bg-green-100 text-green-800' },
    { id: 'moderate', label: 'Moderate', description: 'Some seats available', color: 'bg-yellow-100 text-yellow-800' },
    { id: 'crowded', label: 'Crowded', description: 'Standing room only', color: 'bg-red-100 text-red-800' }
  ];

  const getCrowdingColor = (level: 'light' | 'moderate' | 'crowded'): string => {
    const option = crowdingOptions.find(opt => opt.id === level);
    return option?.color || 'bg-gray-100 text-gray-800';
  };

  const getCrowdingLabel = (level: 'light' | 'moderate' | 'crowded'): string => {
    const option = crowdingOptions.find(opt => opt.id === level);
    return option?.label || 'Unknown';
  };

  const handleSaveLocation = () => {
    const updatedLocation: Participant['location'] = {
      ...participant.location,
      type: 'car',
      carNumber: selectedCar,
      position: selectedPosition,
      crowdingLevel
    };

    onLocationUpdate(updatedLocation);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setSelectedCar(participant.location.carNumber || 1);
    setSelectedPosition(participant.location.position || 'middle');
    setCrowdingLevel(
      (participant.location as any).crowdingLevel || 'moderate'
    );
    setIsEditing(false);
  };

  if (!isEditing) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-medium text-gray-900 flex items-center">
            <Train className="h-4 w-4 mr-2 text-blue-600" />
            Your Location
          </h4>
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center space-x-1 px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
          >
            <Edit3 className="h-3 w-3" />
            <span>Update</span>
          </button>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">
                Car {participant.location.carNumber} - {participant.location.position}
              </p>
              <p className="text-sm text-gray-600 capitalize">
                {trainLine} train • {participant.location.position} of car
              </p>
            </div>
            <div className={`px-2 py-1 rounded text-xs ${getCrowdingColor((participant.location as any).crowdingLevel || 'moderate')}`}>
              <Users className="h-3 w-3 inline mr-1" />
              {getCrowdingLabel((participant.location as any).crowdingLevel || 'moderate')}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-medium text-gray-900 flex items-center">
          <MapPin className="h-4 w-4 mr-2 text-blue-600" />
          Update Your Location
        </h4>
        <div className="text-sm text-gray-600">
          {trainLine} train • {maxCars} cars
        </div>
      </div>

      <div className="space-y-4">
        {/* Car Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Car Number
          </label>
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
            {cars.map(carNumber => (
              <button
                key={carNumber}
                onClick={() => setSelectedCar(carNumber)}
                className={`p-3 rounded-lg border-2 transition-all text-center ${
                  selectedCar === carNumber
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                }`}
              >
                <div className="font-medium">{carNumber}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Position Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Position in Car {selectedCar}
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {positions.map(position => (
              <button
                key={position.id}
                onClick={() => setSelectedPosition(position.id)}
                className={`p-3 rounded-lg border-2 transition-all text-left ${
                  selectedPosition === position.id
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                }`}
              >
                <div className="font-medium">{position.label}</div>
                <div className="text-sm text-gray-600 mt-1">
                  {position.description}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Crowding Level Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            How crowded is this car?
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {crowdingOptions.map(option => (
              <button
                key={option.id}
                onClick={() => setCrowdingLevel(option.id)}
                className={`p-3 rounded-lg border-2 transition-all text-left ${
                  crowdingLevel === option.id
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                }`}
              >
                <div className="font-medium">{option.label}</div>
                <div className="text-sm text-gray-600 mt-1">
                  {option.description}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3 pt-2">
          <button
            onClick={handleSaveLocation}
            className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Check className="h-4 w-4" />
            <span>Update Location</span>
          </button>
          <button
            onClick={handleCancel}
            className="px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>

      <div className="mt-4 p-3 bg-blue-50 rounded-lg border-l-4 border-blue-400">
        <p className="text-sm text-yellow-800">
          <strong>Tip:</strong> Update your car number and crowding level to help your friends find you and know what to expect!
        </p>
      </div>
    </div>
  );
};