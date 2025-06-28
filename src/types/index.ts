export interface Station {
  id: string;
  name: string;
  borough: string;
  lines: string[];
  coordinates: [number, number];
}

export interface Train {
  id: string;
  line: string;
  direction: 'uptown' | 'downtown' | 'eastbound' | 'westbound';
  currentStation: string;
  nextStation: string;
  estimatedArrival: Date;
  cars: number;
  status: 'on_time' | 'delayed' | 'approaching';
}

export interface MeetupSession {
  id: string;
  code: string;
  createdBy: string;
  createdAt: Date;
  station: Station;
  train?: Train;
  participants: Participant[];
  status: 'waiting' | 'boarding' | 'in_transit' | 'completed';
}

export interface Participant {
  id: string;
  name: string;
  location: {
    type: 'platform' | 'train' | 'car';
    station?: string;
    trainId?: string;
    carNumber?: number;
    position?: 'front' | 'middle' | 'rear';
    crowdingLevel?: 'light' | 'moderate' | 'crowded';
  };
  status: 'waiting' | 'boarding' | 'on_train' | 'found';
  lastUpdated: Date;
}

export interface UserLocation {
  station: Station;
  platform?: string;
  train?: Train;
  car?: number;
  position?: 'front' | 'middle' | 'rear';
}