import { Station, Train } from '../types';

export const mockStations: Station[] = [
  {
    id: 'times-sq',
    name: 'Times Square-42nd Street',
    borough: 'Manhattan',
    lines: ['N', 'Q', 'R', 'W', 'S', '1', '2', '3', '7'],
    coordinates: [40.7580, -73.9855]
  },
  {
    id: 'union-sq',
    name: 'Union Square-14th Street',
    borough: 'Manhattan',
    lines: ['N', 'Q', 'R', 'W', '4', '5', '6', 'L'],
    coordinates: [40.7359, -73.9911]
  },
  {
    id: 'grand-central',
    name: 'Grand Central-42nd Street',
    borough: 'Manhattan',
    lines: ['4', '5', '6', '7', 'S'],
    coordinates: [40.7527, -73.9772]
  },
  {
    id: 'herald-sq',
    name: 'Herald Square-34th Street',
    borough: 'Manhattan',
    lines: ['B', 'D', 'F', 'M', 'N', 'Q', 'R', 'W'],
    coordinates: [40.7505, -73.9884]
  },
  {
    id: 'atlantic-ave',
    name: 'Atlantic Avenue-Barclays Center',
    borough: 'Brooklyn',
    lines: ['B', 'D', 'N', 'Q', 'R', 'W', '2', '3', '4', '5'],
    coordinates: [40.6840, -73.9772]
  }
];

export const mockTrains: Train[] = [
  {
    id: 'n-train-1',
    line: 'N',
    direction: 'downtown',
    currentStation: 'times-sq',
    nextStation: 'herald-sq',
    estimatedArrival: new Date(Date.now() + 3 * 60 * 1000),
    cars: 8,
    status: 'approaching'
  },
  {
    id: 'q-train-1',
    line: 'Q',
    direction: 'downtown',
    currentStation: 'times-sq',
    nextStation: 'herald-sq',
    estimatedArrival: new Date(Date.now() + 5 * 60 * 1000),
    cars: 8,
    status: 'on_time'
  },
  {
    id: 'r-train-1',
    line: 'R',
    direction: 'uptown',
    currentStation: 'herald-sq',
    nextStation: 'times-sq',
    estimatedArrival: new Date(Date.now() + 2 * 60 * 1000),
    cars: 10,
    status: 'approaching'
  },
  {
    id: '4-train-1',
    line: '4',
    direction: 'downtown',
    currentStation: 'grand-central',
    nextStation: 'union-sq',
    estimatedArrival: new Date(Date.now() + 4 * 60 * 1000),
    cars: 10,
    status: 'delayed'
  }
];