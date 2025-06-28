import React, { useState, useMemo } from 'react';
import { MapPin, Search, Navigation, Filter, X } from 'lucide-react';
import { Station } from '../types';
import { useMTAStations } from '../hooks/useMTAData';
import { ServiceAlerts } from './ServiceAlerts';
import { useServiceAlerts } from '../hooks/useMTAData';

interface StationSelectorProps {
  onStationSelect: (station: Station) => void;
  selectedStation?: Station;
}

export const StationSelector: React.FC<StationSelectorProps> = ({
  onStationSelect,
  selectedStation
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [selectedBorough, setSelectedBorough] = useState<string>('');
  const [selectedLines, setSelectedLines] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const { stations, loading: stationsLoading, error } = useMTAStations();
  const { alerts } = useServiceAlerts();

  // Get unique boroughs and lines for filters
  const { boroughs, allLines } = useMemo(() => {
    const boroughSet = new Set<string>();
    const lineSet = new Set<string>();
    
    stations.forEach(station => {
      boroughSet.add(station.borough);
      station.lines.forEach(line => lineSet.add(line));
    });
    
    return {
      boroughs: Array.from(boroughSet).sort(),
      allLines: Array.from(lineSet).sort()
    };
  }, [stations]);

  // Filter stations based on search and filters
  const filteredStations = useMemo(() => {
    let filtered = stations;

    // Text search
    if (searchTerm) {
      filtered = filtered.filter(station =>
        station.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        station.borough.toLowerCase().includes(searchTerm.toLowerCase()) ||
        station.lines.some(line => line.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Borough filter
    if (selectedBorough) {
      filtered = filtered.filter(station => station.borough === selectedBorough);
    }

    // Lines filter
    if (selectedLines.length > 0) {
      filtered = filtered.filter(station => 
        selectedLines.some(line => station.lines.includes(line))
      );
    }

    return filtered;
  }, [stations, searchTerm, selectedBorough, selectedLines]);

  const handleLocationDetection = async () => {
    setIsSearching(true);
    try {
      // Try to get user's actual location
      if ('geolocation' in navigator) {
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 300000
          });
        });

        const { latitude, longitude } = position.coords;
        console.log('User location:', latitude, longitude);

        // Find nearest station
        let nearestStation: Station | null = null;
        let minDistance = Infinity;

        for (const station of stations) {
          const distance = calculateDistance(
            latitude,
            longitude,
            station.coordinates[0],
            station.coordinates[1]
          );

          if (distance < minDistance) {
            minDistance = distance;
            nearestStation = station;
          }
        }

        if (nearestStation && minDistance <= 2) { // Within 2km
          onStationSelect(nearestStation);
          console.log(`Found nearest station: ${nearestStation.name} (${minDistance.toFixed(2)}km away)`);
        } else {
          // Fallback to Times Square if no nearby station
          const timesSquare = stations.find(s => s.name.includes('Times Square'));
          if (timesSquare) {
            onStationSelect(timesSquare);
          }
          console.log('No nearby stations found, using Times Square as fallback');
        }
      } else {
        throw new Error('Geolocation not supported');
      }
    } catch (error) {
      console.error('Location detection failed:', error);
      // Fallback to Times Square
      const timesSquare = stations.find(s => s.name.includes('Times Square'));
      if (timesSquare) {
        onStationSelect(timesSquare);
      }
    } finally {
      setIsSearching(false);
    }
  };

  // Calculate distance between two coordinates
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);
    
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const toRadians = (degrees: number): number => {
    return degrees * (Math.PI / 180);
  };

  const toggleLineFilter = (line: string) => {
    setSelectedLines(prev => 
      prev.includes(line) 
        ? prev.filter(l => l !== line)
        : [...prev, line]
    );
  };

  const clearFilters = () => {
    setSelectedBorough('');
    setSelectedLines([]);
    setSearchTerm('');
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

  const activeFiltersCount = (selectedBorough ? 1 : 0) + selectedLines.length;

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-900 flex items-center">
          <MapPin className="h-5 w-5 mr-2 text-blue-600" />
          Select Your Station
        </h3>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
              showFilters || activeFiltersCount > 0
                ? 'bg-blue-100 text-blue-700'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Filter className="h-4 w-4" />
            <span>Filters</span>
            {activeFiltersCount > 0 && (
              <span className="bg-blue-600 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                {activeFiltersCount}
              </span>
            )}
          </button>
          <button
            onClick={handleLocationDetection}
            disabled={isSearching}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            <Navigation className={`h-4 w-4 ${isSearching ? 'animate-spin' : ''}`} />
            <span>{isSearching ? 'Finding...' : 'Use Location'}</span>
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search stations, boroughs, or lines..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg border">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-medium text-gray-900">Filters</h4>
            {activeFiltersCount > 0 && (
              <button
                onClick={clearFilters}
                className="flex items-center space-x-1 text-sm text-gray-600 hover:text-gray-800"
              >
                <X className="h-3 w-3" />
                <span>Clear all</span>
              </button>
            )}
          </div>

          {/* Borough Filter */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Borough</label>
            <div className="flex flex-wrap gap-2">
              {boroughs.map(borough => (
                <button
                  key={borough}
                  onClick={() => setSelectedBorough(selectedBorough === borough ? '' : borough)}
                  className={`px-3 py-1 rounded-full text-sm transition-colors ${
                    selectedBorough === borough
                      ? 'bg-blue-600 text-white'
                      : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {borough}
                </button>
              ))}
            </div>
          </div>

          {/* Lines Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Subway Lines ({selectedLines.length} selected)
            </label>
            <div className="flex flex-wrap gap-2">
              {allLines.map(line => (
                <button
                  key={line}
                  onClick={() => toggleLineFilter(line)}
                  className={`${getLineColor(line)} text-white text-sm font-bold px-3 py-2 rounded-full min-w-[36px] text-center transition-all ${
                    selectedLines.includes(line)
                      ? 'ring-2 ring-blue-500 ring-offset-2 scale-110'
                      : 'opacity-70 hover:opacity-100'
                  }`}
                >
                  {line}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Results Summary */}
      <div className="mb-4 flex items-center justify-between text-sm text-gray-600">
        <span>
          {filteredStations.length} station{filteredStations.length !== 1 ? 's' : ''} found
          {activeFiltersCount > 0 && ` (${activeFiltersCount} filter${activeFiltersCount !== 1 ? 's' : ''} applied)`}
        </span>
        {filteredStations.length > 20 && (
          <span className="text-blue-600">Try using filters to narrow results</span>
        )}
      </div>

      {selectedStation && (
        <div className="mb-6 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">{selectedStation.name}</p>
              <p className="text-sm text-gray-600">{selectedStation.borough}</p>
            </div>
            <div className="flex space-x-1">
              {selectedStation.lines.map(line => (
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
      )}

      {error && (
        <div className="mb-4 p-3 bg-yellow-100 text-yellow-800 rounded-lg text-sm">
          Using offline data: {error}
        </div>
      )}

      {alerts.length > 0 && (
        <div className="mb-6">
          <ServiceAlerts alerts={alerts} className="max-h-48 overflow-y-auto" />
        </div>
      )}

      {stationsLoading && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-2">Loading stations...</p>
        </div>
      )}

      {/* Station List */}
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {filteredStations.length === 0 && !stationsLoading && (
          <div className="text-center py-8">
            <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No stations found matching your criteria</p>
            <button
              onClick={clearFilters}
              className="mt-2 text-blue-600 hover:text-blue-800 text-sm"
            >
              Clear filters to see all stations
            </button>
          </div>
        )}

        {filteredStations.map(station => (
          <button
            key={station.id}
            onClick={() => onStationSelect(station)}
            className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
              selectedStation?.id === station.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900">{station.name}</h4>
                <p className="text-sm text-gray-600">{station.borough}</p>
              </div>
              <div className="flex space-x-1">
                {station.lines.map(line => (
                  <span
                    key={line}
                    className={`${getLineColor(line)} text-white text-sm font-bold px-2 py-1 rounded-full min-w-[28px] text-center`}
                  >
                    {line}
                  </span>
                ))}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};