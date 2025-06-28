import React from 'react';
import { Train as TrainIcon, Clock, AlertCircle } from 'lucide-react';
import { Train, Station } from '../types';
import { useMTATrains, useServiceAlerts } from '../hooks/useMTAData';
import { ServiceAlerts } from './ServiceAlerts';

interface TrainSelectorProps {
  station: Station;
  onTrainSelect: (train: Train) => void;
  selectedTrain?: Train;
}

export const TrainSelector: React.FC<TrainSelectorProps> = ({
  station,
  onTrainSelect,
  selectedTrain
}) => {
  const { trains: availableTrains, loading, error } = useMTATrains(station.id);
  const { alerts } = useServiceAlerts(station.lines);

  const getStatusColor = (status: Train['status']) => {
    switch (status) {
      case 'on_time': return 'text-green-600 bg-green-100';
      case 'delayed': return 'text-red-600 bg-red-100';
      case 'approaching': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: Train['status']) => {
    switch (status) {
      case 'approaching': return <TrainIcon className="h-4 w-4" />;
      case 'delayed': return <AlertCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60));
    if (diff <= 0) return 'Arrived';
    if (diff === 1) return '1 min';
    return `${diff} mins`;
  };

  const getLineColor = (line: string) => {
    const colors: { [key: string]: string } = {
      'N': 'bg-yellow-500',
      'Q': 'bg-yellow-500',
      'R': 'bg-yellow-500',
      'W': 'bg-yellow-500',
      '1': 'bg-red-500',
      '2': 'bg-red-500',
      '3': 'bg-red-500',
      '4': 'bg-green-500',
      '5': 'bg-green-500',
      '6': 'bg-green-500',
      '7': 'bg-purple-500',
      'B': 'bg-orange-500',
      'D': 'bg-orange-500',
      'F': 'bg-orange-500',
      'M': 'bg-orange-500',
      'A': 'bg-blue-600',
      'C': 'bg-blue-600',
      'E': 'bg-blue-600',
      'G': 'bg-lime-500',
      'J': 'bg-amber-600',
      'Z': 'bg-amber-600',
      'L': 'bg-gray-500',
      'S': 'bg-gray-600',
      'SIR': 'bg-blue-800'
    };
    return colors[line] || 'bg-blue-500';
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
        <TrainIcon className="h-5 w-5 mr-2 text-blue-600" />
        Available Trains at {station.name}
      </h3>

      {error && (
        <div className="mb-4 p-3 bg-yellow-100 text-yellow-800 rounded-lg text-sm">
          Using offline data: {error}
        </div>
      )}

      {alerts.length > 0 && (
        <div className="mb-4">
          <ServiceAlerts alerts={alerts} lines={station.lines} />
        </div>
      )}

      {loading && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-2">Loading real-time train data...</p>
        </div>
      )}

      {availableTrains.length === 0 ? (
        <div className="text-center py-8">
          <TrainIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">
            {loading ? 'Loading trains...' : 'No trains currently available at this station'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {availableTrains.map(train => (
            <button
              key={train.id}
              onClick={() => onTrainSelect(train)}
              className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                selectedTrain?.id === train.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`${getLineColor(train.line)} text-white text-lg font-bold px-3 py-2 rounded-full min-w-[48px] text-center`}>
                    {train.line}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 capitalize">
                      {train.direction} • {train.cars} cars
                    </p>
                    <p className="text-sm text-gray-600">
                      {train.currentStation === station.id ? 'At station' : `Next: ${formatTime(train.estimatedArrival)}`}
                    </p>
                  </div>
                </div>
                <div className={`flex items-center space-x-2 px-3 py-1 rounded-full ${getStatusColor(train.status)}`}>
                  {getStatusIcon(train.status)}
                  <span className="text-sm font-medium capitalize">{train.status.replace('_', ' ')}</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};