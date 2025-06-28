// MTA API configuration - Use correct public API endpoints from https://api.mta.info/#/subwayRealTimeFeeds
export const MTA_API_BASE = '/api-endpoint/Dataservice/mtagtfsfeeds';

// GTFS-Realtime feed endpoints - Each line group has its own specific endpoint
export const GTFS_FEEDS = {
  // IRT Lines (numbered lines) - Feed ID: nyct%2Fgtfs
  '1234567S': 'nyct%2Fgtfs',
  
  // BMT Lines
  'NQRW': 'nyct%2Fgtfs-nqrw',     // N, Q, R, W lines
  'BDFM': 'nyct%2Fgtfs-bdfm',     // B, D, F, M lines  
  'JZ': 'nyct%2Fgtfs-jz',         // J, Z lines
  
  // IND Lines  
  'ACE': 'nyct%2Fgtfs-ace',       // A, C, E lines
  'G': 'nyct%2Fgtfs-g',           // G line
  'L': 'nyct%2Fgtfs-l',           // L line
  
  // Staten Island Railway
  'SI': 'nyct%2Fgtfs-si'          // SIR line
};

// Service alerts endpoint
export const ALERTS_FEED = 'camsys%2Fall-alerts';

export const getFeedForLine = (line: string): string => {
  // IRT Lines (1, 2, 3, 4, 5, 6, 7, S)
  if (['1', '2', '3', '4', '5', '6', '7', 'S'].includes(line)) {
    return GTFS_FEEDS['1234567S'];
  }
  
  // NQRW Lines
  if (['N', 'Q', 'R', 'W'].includes(line)) {
    return GTFS_FEEDS['NQRW'];
  }
  
  // BDFM Lines
  if (['B', 'D', 'F', 'M'].includes(line)) {
    return GTFS_FEEDS['BDFM'];
  }
  
  // ACE Lines
  if (['A', 'C', 'E'].includes(line)) {
    return GTFS_FEEDS['ACE'];
  }
  
  // G Line
  if (line === 'G') {
    return GTFS_FEEDS['G'];
  }
  
  // JZ Lines
  if (['J', 'Z'].includes(line)) {
    return GTFS_FEEDS['JZ'];
  }
  
  // L Line
  if (line === 'L') {
    return GTFS_FEEDS['L'];
  }
  
  // Staten Island Railway
  if (line === 'SIR') {
    return GTFS_FEEDS['SI'];
  }
  
  // Default fallback to numbered lines feed
  return GTFS_FEEDS['1234567S'];
};

export const getCarsForLine = (line: string): number => {
  // Accurate car counts for different MTA lines
  if (['1', '2', '3', '4', '5', '6'].includes(line)) {
    return 10; // IRT lines have 10 cars
  }
  if (line === '7') {
    return 11; // 7 express has 11 cars, local has 10
  }
  if (['N', 'Q', 'R', 'W', 'B', 'D', 'F', 'M', 'A', 'C', 'E', 'G', 'J', 'Z', 'L'].includes(line)) {
    return 8; // BMT/IND lines have 8 cars
  }
  if (line === 'S') {
    return 4; // Shuttle trains are shorter
  }
  if (line === 'SIR') {
    return 4; // Staten Island Railway cars
  }
  return 8; // Default
};

// Line group mappings for easier reference
export const LINE_GROUPS = {
  IRT: ['1', '2', '3', '4', '5', '6', '7', 'S'],
  BMT_NQRW: ['N', 'Q', 'R', 'W'],
  BMT_BDFM: ['B', 'D', 'F', 'M'],
  BMT_JZ: ['J', 'Z'],
  IND_ACE: ['A', 'C', 'E'],
  IND_G: ['G'],
  IND_L: ['L'],
  SIR: ['SIR']
};

// Get all lines for a specific feed
export const getLinesForFeed = (feedName: string): string[] => {
  switch (feedName) {
    case 'nyct%2Fgtfs':
      return LINE_GROUPS.IRT;
    case 'nyct%2Fgtfs-nqrw':
      return LINE_GROUPS.BMT_NQRW;
    case 'nyct%2Fgtfs-bdfm':
      return LINE_GROUPS.BMT_BDFM;
    case 'nyct%2Fgtfs-jz':
      return LINE_GROUPS.BMT_JZ;
    case 'nyct%2Fgtfs-ace':
      return LINE_GROUPS.IND_ACE;
    case 'nyct%2Fgtfs-g':
      return LINE_GROUPS.IND_G;
    case 'nyct%2Fgtfs-l':
      return LINE_GROUPS.IND_L;
    case 'nyct%2Fgtfs-si':
      return LINE_GROUPS.SIR;
    default:
      return [];
  }
};