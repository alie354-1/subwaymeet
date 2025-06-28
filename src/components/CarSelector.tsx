import React from 'react';
import { Train as TrainIcon, MapPin, Users } from 'lucide-react';
import { Train } from '../types';

interface CarSelectorProps {
  train: Train;
  onCarSelect: (carNumber: number, position: 'front' | 'middle' | 'rear') => void;
  selectedCar?: { number: number; position: 'front' | 'middle' | 'rear' };
}

export const CarSelector: React.FC<CarSelectorProps> = ({
  train,
  onCarSelect,
  selectedCar
}) => {
  const positions: Array<{ 
    id: 'front' | 'middle' | 'rear'; 
    label: string; 
    description: string;
    icon: string;
    carInfo: string;
  }> = [
    { 
      id: 'front', 
      label: 'First Car', 
      description: 'Near the conductor, usually less crowded',
      icon: '🚇',
      carInfo: 'Car 1'
    },
    { 
      id: 'middle', 
      label: 'One of the Middle Cars', 
      description: 'Center of the train, you can specify exact car later',
      icon: '🚃',
      carInfo: `Cars 2-${train.cars - 1}`
    },
    { 
      id: 'rear', 
      label: 'Last Car', 
      description: 'Back of the train, often less crowded',
      icon: '🚋',
      carInfo: `Car ${train.cars}`
    }
  ];

  const handlePositionSelect = (position: 'front' | 'middle' | 'rear') => {
    // For front/rear, use car 1 or last car. For middle, use a representative middle car
    let carNumber: number;
    if (position === 'front') {
      carNumber = 1;
    } else if (position === 'rear') {
      carNumber = train.cars;
    } else {
      // For middle, use a car that's roughly in the middle but user can update later
      carNumber = Math.ceil(train.cars / 2);
    }
    
    onCarSelect(carNumber, position);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
        <TrainIcon className="h-5 w-5 mr-2 text-blue-600" />
        Choose Your Position - {train.line} Train
      </h3>

      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
          <span>Direction: {train.direction}</span>
          <span>{train.cars} cars total</span>
        </div>
        
        {/* Visual train representation */}
        <div className="flex items-center space-x-1 mb-2">
          <div className="text-xs text-gray-500">Front</div>
          <div className="flex-1 flex space-x-1">
            {Array.from({ length: Math.min(train.cars, 10) }, (_, i) => (
              <div
                key={i}
                className={`flex-1 h-6 rounded border-2 transition-all ${
                  selectedCar && (
                    (selectedCar.position === 'front' && i === 0) ||
                    (selectedCar.position === 'rear' && i === Math.min(train.cars, 10) - 1) ||
                    (selectedCar.position === 'middle' && i > 0 && i < Math.min(train.cars, 10) - 1)
                  )
                    ? 'bg-blue-500 border-blue-600'
                    : 'bg-white border-gray-300'
                }`}
              />
            ))}
            {train.cars > 10 && (
              <div className="text-xs text-gray-500">+{train.cars - 10}</div>
            )}
          </div>
          <div className="text-xs text-gray-500">Rear</div>
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="font-medium text-gray-900 mb-3">Select your general position:</h4>
        
        {positions.map(position => (
          <button
            key={position.id}
            onClick={() => handlePositionSelect(position.id)}
            className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
              selectedCar?.position === position.id
                ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-md'
                : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center space-x-4">
              <div className="text-2xl">{position.icon}</div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h5 className="font-semibold text-lg">{position.label}</h5>
                  {selectedCar?.position === position.id && (
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-medium">Selected</span>
                    </div>
                  )}
                </div>
                <p className="text-sm text-gray-600 mb-2">{position.description}</p>
                
                {/* Show car range */}
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    {position.carInfo}
                  </span>
                  {position.id === 'middle' && (
                    <span className="text-xs text-blue-600 font-medium">
                      Specify exact car once aboard
                    </span>
                  )}
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>

      {selectedCar && (
        <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
          <div className="flex items-center space-x-3 mb-2">
            <div className="bg-blue-100 p-2 rounded-full">
              <Users className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <p className="font-semibold text-gray-900">
                Position Selected: {
                  selectedCar.position === 'front' ? 'First Car' : 
                  selectedCar.position === 'rear' ? 'Last Car' : 
                  'One of the Middle Cars'
                }
              </p>
              <p className="text-sm text-gray-600">
                {selectedCar.position === 'middle' 
                  ? 'You can update your exact car number and crowding level once you board'
                  : 'You can update crowding level and confirm your position once you board'
                }
              </p>
            </div>
          </div>
          
          <div className="mt-3 p-3 bg-white rounded-lg border border-blue-200">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">
                {selectedCar.position === 'middle' ? 'Estimated car:' : 'Car assignment:'}
              </span>
              <span className="text-sm font-bold text-blue-700">Car {selectedCar.number}</span>
            </div>
          </div>
        </div>
      )}

      <div className="mt-4 p-3 bg-yellow-50 rounded-lg border-l-4 border-yellow-400">
        <p className="text-sm text-yellow-800">
          <strong>💡 Tip:</strong> Choose your general position now. Once you're on the train, you can update your exact car number and report how crowded it is to help your friends find you!
        </p>
      </div>
    </div>
  );
};