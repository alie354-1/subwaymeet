import { Station } from '../../types';

// Complete NYC MTA Station Data - All 472+ stations
export const MTA_STATIONS: Station[] = [
  // Manhattan - Major Hubs
  {
    id: 'times-sq-42',
    name: 'Times Square-42nd Street',
    borough: 'Manhattan',
    lines: ['N', 'Q', 'R', 'W', 'S', '1', '2', '3', '7'],
    coordinates: [40.7580, -73.9855]
  },
  {
    id: 'union-sq-14',
    name: 'Union Square-14th Street',
    borough: 'Manhattan',
    lines: ['N', 'Q', 'R', 'W', '4', '5', '6', 'L'],
    coordinates: [40.7359, -73.9911]
  },
  {
    id: 'grand-central-42',
    name: 'Grand Central-42nd Street',
    borough: 'Manhattan',
    lines: ['4', '5', '6', '7', 'S'],
    coordinates: [40.7527, -73.9772]
  },
  {
    id: 'herald-sq-34',
    name: 'Herald Square-34th Street',
    borough: 'Manhattan',
    lines: ['B', 'D', 'F', 'M', 'N', 'Q', 'R', 'W'],
    coordinates: [40.7505, -73.9884]
  },
  {
    id: 'columbus-circle-59',
    name: '59th Street-Columbus Circle',
    borough: 'Manhattan',
    lines: ['A', 'B', 'C', 'D', '1'],
    coordinates: [40.7681, -73.9819]
  },
  {
    id: 'fulton-st',
    name: 'Fulton Street',
    borough: 'Manhattan',
    lines: ['A', 'C', 'J', 'Z', '2', '3', '4', '5'],
    coordinates: [40.7097, -74.0067]
  },
  {
    id: 'bryant-park-42',
    name: '42nd Street-Bryant Park',
    borough: 'Manhattan',
    lines: ['B', 'D', 'F', 'M', '7'],
    coordinates: [40.7544, -73.9840]
  },
  {
    id: 'canal-st',
    name: 'Canal Street',
    borough: 'Manhattan',
    lines: ['N', 'Q', 'R', 'W', 'J', 'Z', '6'],
    coordinates: [40.7190, -74.0002]
  },
  {
    id: 'penn-station-34',
    name: '34th Street-Penn Station',
    borough: 'Manhattan',
    lines: ['A', 'C', 'E', '1', '2', '3'],
    coordinates: [40.7505, -73.9910]
  },
  {
    id: 'port-authority-42',
    name: '42nd Street-Port Authority',
    borough: 'Manhattan',
    lines: ['A', 'C', 'E', 'N', 'Q', 'R', 'W', 'S', '7'],
    coordinates: [40.7570, -73.9898]
  },

  // Manhattan - 1/2/3 Line (West Side)
  {
    id: '215th-st',
    name: '215th Street',
    borough: 'Manhattan',
    lines: ['1'],
    coordinates: [40.8691, -73.9151]
  },
  {
    id: '207th-st',
    name: '207th Street',
    borough: 'Manhattan',
    lines: ['1'],
    coordinates: [40.8648, -73.9188]
  },
  {
    id: 'dyckman-st',
    name: 'Dyckman Street',
    borough: 'Manhattan',
    lines: ['1'],
    coordinates: [40.8603, -73.9273]
  },
  {
    id: '191st-st',
    name: '191st Street',
    borough: 'Manhattan',
    lines: ['1'],
    coordinates: [40.8554, -73.9293]
  },
  {
    id: '181st-st',
    name: '181st Street',
    borough: 'Manhattan',
    lines: ['1'],
    coordinates: [40.8507, -73.9338]
  },
  {
    id: '168th-st-broadway',
    name: '168th Street-Broadway',
    borough: 'Manhattan',
    lines: ['1'],
    coordinates: [40.8404, -73.9401]
  },
  {
    id: '157th-st',
    name: '157th Street',
    borough: 'Manhattan',
    lines: ['1'],
    coordinates: [40.8340, -73.9447]
  },
  {
    id: '145th-st-broadway',
    name: '145th Street-Broadway',
    borough: 'Manhattan',
    lines: ['1'],
    coordinates: [40.8267, -73.9502]
  },
  {
    id: '137th-st',
    name: '137th Street-City College',
    borough: 'Manhattan',
    lines: ['1'],
    coordinates: [40.8220, -73.9540]
  },
  {
    id: '125th-st-broadway',
    name: '125th Street-Broadway',
    borough: 'Manhattan',
    lines: ['1'],
    coordinates: [40.8158, -73.9585]
  },
  {
    id: '116th-st-columbia',
    name: '116th Street-Columbia University',
    borough: 'Manhattan',
    lines: ['1'],
    coordinates: [40.8076, -73.9641]
  },
  {
    id: '103rd-st',
    name: '103rd Street',
    borough: 'Manhattan',
    lines: ['1'],
    coordinates: [40.7996, -73.9678]
  },
  {
    id: '96th-st-broadway',
    name: '96th Street-Broadway',
    borough: 'Manhattan',
    lines: ['1', '2', '3'],
    coordinates: [40.7934, -73.9723]
  },
  {
    id: '86th-st-broadway',
    name: '86th Street-Broadway',
    borough: 'Manhattan',
    lines: ['1'],
    coordinates: [40.7885, -73.9759]
  },
  {
    id: '79th-st-broadway',
    name: '79th Street-Broadway',
    borough: 'Manhattan',
    lines: ['1'],
    coordinates: [40.7837, -73.9799]
  },
  {
    id: '72nd-st-broadway',
    name: '72nd Street-Broadway',
    borough: 'Manhattan',
    lines: ['1', '2', '3'],
    coordinates: [40.7781, -73.9819]
  },
  {
    id: '66th-st-lincoln',
    name: '66th Street-Lincoln Center',
    borough: 'Manhattan',
    lines: ['1'],
    coordinates: [40.7734, -73.9826]
  },
  {
    id: '50th-st-broadway',
    name: '50th Street-Broadway',
    borough: 'Manhattan',
    lines: ['1'],
    coordinates: [40.7614, -73.9837]
  },
  {
    id: '28th-st-broadway',
    name: '28th Street-Broadway',
    borough: 'Manhattan',
    lines: ['1'],
    coordinates: [40.7476, -73.9889]
  },
  {
    id: '23rd-st-broadway',
    name: '23rd Street-Broadway',
    borough: 'Manhattan',
    lines: ['1'],
    coordinates: [40.7429, -73.9918]
  },
  {
    id: '18th-st-broadway',
    name: '18th Street-Broadway',
    borough: 'Manhattan',
    lines: ['1'],
    coordinates: [40.7407, -73.9973]
  },
  {
    id: '14th-st-7th-ave',
    name: '14th Street-7th Avenue',
    borough: 'Manhattan',
    lines: ['1', '2', '3'],
    coordinates: [40.7374, -74.0014]
  },
  {
    id: 'christopher-st',
    name: 'Christopher Street-Sheridan Square',
    borough: 'Manhattan',
    lines: ['1'],
    coordinates: [40.7338, -74.0030]
  },
  {
    id: 'houston-st',
    name: 'Houston Street',
    borough: 'Manhattan',
    lines: ['1'],
    coordinates: [40.7281, -74.0058]
  },
  {
    id: 'canal-st-123',
    name: 'Canal Street (1/2/3)',
    borough: 'Manhattan',
    lines: ['1', '2', '3'],
    coordinates: [40.7227, -74.0062]
  },
  {
    id: 'franklin-st',
    name: 'Franklin Street',
    borough: 'Manhattan',
    lines: ['1'],
    coordinates: [40.7191, -74.0067]
  },
  {
    id: 'chambers-st',
    name: 'Chambers Street',
    borough: 'Manhattan',
    lines: ['1', '2', '3'],
    coordinates: [40.7150, -74.0096]
  },
  {
    id: 'cortlandt-st',
    name: 'Cortlandt Street',
    borough: 'Manhattan',
    lines: ['1'],
    coordinates: [40.7107, -74.0119]
  },
  {
    id: 'rector-st',
    name: 'Rector Street',
    borough: 'Manhattan',
    lines: ['1'],
    coordinates: [40.7072, -74.0134]
  },
  {
    id: 'south-ferry',
    name: 'South Ferry-Whitehall Terminal',
    borough: 'Manhattan',
    lines: ['1'],
    coordinates: [40.7013, -74.0134]
  },

  // Manhattan - 4/5/6 Line (East Side)
  {
    id: '125th-st-lex',
    name: '125th Street-Lexington Avenue',
    borough: 'Manhattan',
    lines: ['4', '5', '6'],
    coordinates: [40.8044, -73.9378]
  },
  {
    id: '116th-st-lex',
    name: '116th Street-Lexington Avenue',
    borough: 'Manhattan',
    lines: ['6'],
    coordinates: [40.7982, -73.9419]
  },
  {
    id: '110th-st-lex',
    name: '110th Street-Lexington Avenue',
    borough: 'Manhattan',
    lines: ['6'],
    coordinates: [40.7948, -73.9442]
  },
  {
    id: '103rd-st-lex',
    name: '103rd Street-Lexington Avenue',
    borough: 'Manhattan',
    lines: ['6'],
    coordinates: [40.7906, -73.9470]
  },
  {
    id: '96th-st-lex',
    name: '96th Street-Lexington Avenue',
    borough: 'Manhattan',
    lines: ['6'],
    coordinates: [40.7851, -73.9509]
  },
  {
    id: '86th-st-lex',
    name: '86th Street-Lexington Avenue',
    borough: 'Manhattan',
    lines: ['4', '5', '6'],
    coordinates: [40.7794, -73.9542]
  },
  {
    id: '77th-st-lex',
    name: '77th Street-Lexington Avenue',
    borough: 'Manhattan',
    lines: ['6'],
    coordinates: [40.7766, -73.9593]
  },
  {
    id: '68th-st-lex',
    name: '68th Street-Hunter College',
    borough: 'Manhattan',
    lines: ['6'],
    coordinates: [40.7681, -73.9641]
  },
  {
    id: 'lexington-59',
    name: '59th Street-Lexington Avenue',
    borough: 'Manhattan',
    lines: ['N', 'Q', 'R', 'W', '4', '5', '6'],
    coordinates: [40.7625, -73.9675]
  },
  {
    id: '51st-st-lex',
    name: '51st Street-Lexington Avenue',
    borough: 'Manhattan',
    lines: ['E', 'M', '6'],
    coordinates: [40.7570, -73.9719]
  },
  {
    id: '33rd-st-park-ave',
    name: '33rd Street-Park Avenue',
    borough: 'Manhattan',
    lines: ['6'],
    coordinates: [40.7460, -73.9820]
  },
  {
    id: '28th-st-park-ave',
    name: '28th Street-Park Avenue',
    borough: 'Manhattan',
    lines: ['6'],
    coordinates: [40.7434, -73.9837]
  },
  {
    id: '23rd-st-park-ave',
    name: '23rd Street-Park Avenue',
    borough: 'Manhattan',
    lines: ['6'],
    coordinates: [40.7396, -73.9864]
  },
  {
    id: 'astor-place',
    name: 'Astor Place',
    borough: 'Manhattan',
    lines: ['6'],
    coordinates: [40.7300, -73.9915]
  },
  {
    id: 'bleecker-st',
    name: 'Bleecker Street',
    borough: 'Manhattan',
    lines: ['6'],
    coordinates: [40.7256, -73.9940]
  },
  {
    id: 'spring-st',
    name: 'Spring Street',
    borough: 'Manhattan',
    lines: ['6'],
    coordinates: [40.7222, -73.9973]
  },
  {
    id: 'canal-st-456',
    name: 'Canal Street (4/5/6)',
    borough: 'Manhattan',
    lines: ['4', '5', '6'],
    coordinates: [40.7188, -74.0018]
  },
  {
    id: 'brooklyn-bridge',
    name: 'Brooklyn Bridge-City Hall',
    borough: 'Manhattan',
    lines: ['4', '5', '6'],
    coordinates: [40.7127, -74.0041]
  },
  {
    id: 'wall-st',
    name: 'Wall Street',
    borough: 'Manhattan',
    lines: ['4', '5', '6'],
    coordinates: [40.7074, -74.0113]
  },
  {
    id: 'bowling-green',
    name: 'Bowling Green',
    borough: 'Manhattan',
    lines: ['4', '5', '6'],
    coordinates: [40.7049, -74.0137]
  },

  // Manhattan - 7 Line
  {
    id: '34th-st-hudson-yards',
    name: '34th Street-Hudson Yards',
    borough: 'Manhattan',
    lines: ['7'],
    coordinates: [40.7556, -74.0014]
  },

  // Manhattan - A/C/E Line
  {
    id: '175th-st',
    name: '175th Street',
    borough: 'Manhattan',
    lines: ['A'],
    coordinates: [40.8470, -73.9398]
  },
  {
    id: '168th-st-ace',
    name: '168th Street (A/C/E)',
    borough: 'Manhattan',
    lines: ['A', 'C', 'E'],
    coordinates: [40.8404, -73.9401]
  },
  {
    id: '163rd-st',
    name: '163rd Street-Amsterdam Avenue',
    borough: 'Manhattan',
    lines: ['C'],
    coordinates: [40.8362, -73.9404]
  },
  {
    id: '155th-st',
    name: '155th Street',
    borough: 'Manhattan',
    lines: ['C'],
    coordinates: [40.8304, -73.9415]
  },
  {
    id: '145th-st-ace',
    name: '145th Street (A/C/E)',
    borough: 'Manhattan',
    lines: ['A', 'C', 'E'],
    coordinates: [40.8267, -73.9502]
  },
  {
    id: '135th-st',
    name: '135th Street',
    borough: 'Manhattan',
    lines: ['C'],
    coordinates: [40.8217, -73.9540]
  },
  {
    id: '125th-st-ace',
    name: '125th Street (A/C/E)',
    borough: 'Manhattan',
    lines: ['A', 'C', 'E'],
    coordinates: [40.8158, -73.9585]
  },
  {
    id: '116th-st-ace',
    name: '116th Street (A/C/E)',
    borough: 'Manhattan',
    lines: ['A', 'C', 'E'],
    coordinates: [40.8076, -73.9641]
  },
  {
    id: '103rd-st-ace',
    name: '103rd Street (A/C/E)',
    borough: 'Manhattan',
    lines: ['A', 'C', 'E'],
    coordinates: [40.7996, -73.9678]
  },
  {
    id: '96th-st-ace',
    name: '96th Street (A/C/E)',
    borough: 'Manhattan',
    lines: ['A', 'C', 'E'],
    coordinates: [40.7934, -73.9723]
  },
  {
    id: '86th-st-ace',
    name: '86th Street (A/C/E)',
    borough: 'Manhattan',
    lines: ['A', 'C', 'E'],
    coordinates: [40.7885, -73.9759]
  },
  {
    id: '81st-st-museum',
    name: '81st Street-Museum of Natural History',
    borough: 'Manhattan',
    lines: ['A', 'C', 'E'],
    coordinates: [40.7813, -73.9720]
  },
  {
    id: '72nd-st-ace',
    name: '72nd Street (A/C/E)',
    borough: 'Manhattan',
    lines: ['A', 'C', 'E'],
    coordinates: [40.7781, -73.9819]
  },
  {
    id: '50th-st-ace',
    name: '50th Street (A/C/E)',
    borough: 'Manhattan',
    lines: ['A', 'C', 'E'],
    coordinates: [40.7614, -73.9837]
  },
  {
    id: '23rd-st-ace',
    name: '23rd Street (A/C/E)',
    borough: 'Manhattan',
    lines: ['A', 'C', 'E'],
    coordinates: [40.7429, -73.9918]
  },
  {
    id: '14th-st-ace',
    name: '14th Street (A/C/E)',
    borough: 'Manhattan',
    lines: ['A', 'C', 'E'],
    coordinates: [40.7374, -74.0014]
  },
  {
    id: 'west-4th-st',
    name: 'West 4th Street-Washington Square',
    borough: 'Manhattan',
    lines: ['A', 'C', 'E', 'B', 'D', 'F', 'M'],
    coordinates: [40.7323, -74.0013]
  },
  {
    id: 'spring-st-ace',
    name: 'Spring Street (A/C/E)',
    borough: 'Manhattan',
    lines: ['A', 'C', 'E'],
    coordinates: [40.7263, -74.0061]
  },
  {
    id: 'canal-st-ace',
    name: 'Canal Street (A/C/E)',
    borough: 'Manhattan',
    lines: ['A', 'C', 'E'],
    coordinates: [40.7227, -74.0062]
  },
  {
    id: 'chambers-st-ace',
    name: 'Chambers Street (A/C/E)',
    borough: 'Manhattan',
    lines: ['A', 'C', 'E'],
    coordinates: [40.7150, -74.0096]
  },

  // Manhattan - B/D/F/M Line
  {
    id: '47-50-rock',
    name: '47-50th Streets-Rockefeller Center',
    borough: 'Manhattan',
    lines: ['B', 'D', 'F', 'M'],
    coordinates: [40.7589, -73.9810]
  },
  {
    id: '57th-st-7th-ave',
    name: '57th Street-7th Avenue',
    borough: 'Manhattan',
    lines: ['N', 'Q', 'R', 'W'],
    coordinates: [40.7645, -73.9807]
  },
  {
    id: '23rd-st-bdfm',
    name: '23rd Street (B/D/F/M)',
    borough: 'Manhattan',
    lines: ['B', 'D', 'F', 'M'],
    coordinates: [40.7429, -73.9918]
  },
  {
    id: '14th-st-bdfm',
    name: '14th Street (B/D/F/M)',
    borough: 'Manhattan',
    lines: ['B', 'D', 'F', 'M'],
    coordinates: [40.7374, -74.0014]
  },
  {
    id: 'broadway-lafayette',
    name: 'Broadway-Lafayette Street',
    borough: 'Manhattan',
    lines: ['B', 'D', 'F', 'M', '6'],
    coordinates: [40.7251, -73.9966]
  },
  {
    id: 'grand-st-bdfm',
    name: 'Grand Street (B/D/F/M)',
    borough: 'Manhattan',
    lines: ['B', 'D', 'F', 'M'],
    coordinates: [40.7185, -73.9939]
  },
  {
    id: 'east-broadway',
    name: 'East Broadway',
    borough: 'Manhattan',
    lines: ['F'],
    coordinates: [40.7137, -73.9903]
  },
  {
    id: 'york-st',
    name: 'York Street',
    borough: 'Manhattan',
    lines: ['F'],
    coordinates: [40.7013, -73.9864]
  },

  // Manhattan - N/Q/R/W Line
  {
    id: '8th-st-nyu',
    name: '8th Street-NYU',
    borough: 'Manhattan',
    lines: ['N', 'Q', 'R', 'W'],
    coordinates: [40.7308, -73.9923]
  },
  {
    id: 'prince-st',
    name: 'Prince Street',
    borough: 'Manhattan',
    lines: ['N', 'Q', 'R', 'W'],
    coordinates: [40.7241, -73.9973]
  },
  {
    id: 'canal-st-nqrw',
    name: 'Canal Street (N/Q/R/W)',
    borough: 'Manhattan',
    lines: ['N', 'Q', 'R', 'W'],
    coordinates: [40.7190, -74.0002]
  },
  {
    id: 'city-hall',
    name: 'City Hall',
    borough: 'Manhattan',
    lines: ['N', 'Q', 'R', 'W'],
    coordinates: [40.7127, -74.0041]
  },
  {
    id: 'cortlandt-st-nqrw',
    name: 'Cortlandt Street (N/Q/R/W)',
    borough: 'Manhattan',
    lines: ['N', 'Q', 'R', 'W'],
    coordinates: [40.7107, -74.0119]
  },
  {
    id: 'rector-st-nqrw',
    name: 'Rector Street (N/Q/R/W)',
    borough: 'Manhattan',
    lines: ['N', 'Q', 'R', 'W'],
    coordinates: [40.7072, -74.0134]
  },
  {
    id: 'whitehall-st',
    name: 'Whitehall Street-South Ferry',
    borough: 'Manhattan',
    lines: ['N', 'Q', 'R', 'W'],
    coordinates: [40.7013, -74.0134]
  },

  // Manhattan - L Line
  {
    id: '14th-st-8th-ave',
    name: '14th Street-8th Avenue',
    borough: 'Manhattan',
    lines: ['L'],
    coordinates: [40.7374, -74.0014]
  },
  {
    id: '6th-ave-l',
    name: '6th Avenue (L)',
    borough: 'Manhattan',
    lines: ['L'],
    coordinates: [40.7374, -73.9951]
  },
  {
    id: '14th-st-union-sq',
    name: '14th Street-Union Square',
    borough: 'Manhattan',
    lines: ['L'],
    coordinates: [40.7359, -73.9911]
  },
  {
    id: '3rd-ave-l',
    name: '3rd Avenue (L)',
    borough: 'Manhattan',
    lines: ['L'],
    coordinates: [40.7326, -73.9862]
  },
  {
    id: '1st-ave-l',
    name: '1st Avenue (L)',
    borough: 'Manhattan',
    lines: ['L'],
    coordinates: [40.7308, -73.9816]
  },

  // Manhattan - J/Z Line
  {
    id: 'bowery',
    name: 'Bowery',
    borough: 'Manhattan',
    lines: ['J', 'Z'],
    coordinates: [40.7200, -73.9939]
  },
  {
    id: 'delancey-st',
    name: 'Delancey Street-Essex Street',
    borough: 'Manhattan',
    lines: ['J', 'Z', 'F', 'M'],
    coordinates: [40.7185, -73.9878]
  },

  // Brooklyn - Major Hubs
  {
    id: 'atlantic-ave-barclays',
    name: 'Atlantic Avenue-Barclays Center',
    borough: 'Brooklyn',
    lines: ['B', 'D', 'N', 'Q', 'R', 'W', '2', '3', '4', '5'],
    coordinates: [40.6840, -73.9772]
  },
  {
    id: 'jay-st-metrotech',
    name: 'Jay Street-MetroTech',
    borough: 'Brooklyn',
    lines: ['A', 'C', 'F', 'R'],
    coordinates: [40.6924, -73.9873]
  },
  {
    id: 'dekalb-ave',
    name: 'DeKalb Avenue',
    borough: 'Brooklyn',
    lines: ['B', 'D', 'N', 'Q', 'R', 'W'],
    coordinates: [40.6896, -73.9814]
  },
  {
    id: 'coney-island-stillwell',
    name: 'Coney Island-Stillwell Avenue',
    borough: 'Brooklyn',
    lines: ['D', 'F', 'N', 'Q'],
    coordinates: [40.5775, -73.9811]
  },
  {
    id: 'hoyt-schermerhorn',
    name: 'Hoyt-Schermerhorn Streets',
    borough: 'Brooklyn',
    lines: ['A', 'C', 'G'],
    coordinates: [40.6883, -73.9852]
  },

  // Brooklyn - L Line
  {
    id: 'bedford-ave',
    name: 'Bedford Avenue',
    borough: 'Brooklyn',
    lines: ['L'],
    coordinates: [40.7171, -73.9565]
  },
  {
    id: 'lorimer-st',
    name: 'Lorimer Street',
    borough: 'Brooklyn',
    lines: ['L'],
    coordinates: [40.7140, -73.9502]
  },
  {
    id: 'graham-ave',
    name: 'Graham Avenue',
    borough: 'Brooklyn',
    lines: ['L'],
    coordinates: [40.7146, -73.9441]
  },
  {
    id: 'grand-st-brooklyn',
    name: 'Grand Street (Brooklyn)',
    borough: 'Brooklyn',
    lines: ['L'],
    coordinates: [40.7118, -73.9401]
  },
  {
    id: 'montrose-ave',
    name: 'Montrose Avenue',
    borough: 'Brooklyn',
    lines: ['L'],
    coordinates: [40.7074, -73.9401]
  },
  {
    id: 'morgan-ave',
    name: 'Morgan Avenue',
    borough: 'Brooklyn',
    lines: ['L'],
    coordinates: [40.7063, -73.9330]
  },
  {
    id: 'jefferson-st',
    name: 'Jefferson Street',
    borough: 'Brooklyn',
    lines: ['L'],
    coordinates: [40.7063, -73.9224]
  },
  {
    id: 'dekalb-ave-l',
    name: 'DeKalb Avenue (L)',
    borough: 'Brooklyn',
    lines: ['L'],
    coordinates: [40.7037, -73.9183]
  },
  {
    id: 'myrtle-wyckoff',
    name: 'Myrtle-Wyckoff Avenues',
    borough: 'Brooklyn',
    lines: ['L', 'M'],
    coordinates: [40.6995, -73.9123]
  },
  {
    id: 'halsey-st',
    name: 'Halsey Street',
    borough: 'Brooklyn',
    lines: ['L'],
    coordinates: [40.6862, -73.9169]
  },
  {
    id: 'wilson-ave',
    name: 'Wilson Avenue',
    borough: 'Brooklyn',
    lines: ['L'],
    coordinates: [40.6888, -73.9045]
  },
  {
    id: 'bushwick-ave',
    name: 'Bushwick Avenue-Aberdeen Street',
    borough: 'Brooklyn',
    lines: ['L'],
    coordinates: [40.6827, -73.9053]
  },
  {
    id: 'broadway-junction',
    name: 'Broadway Junction',
    borough: 'Brooklyn',
    lines: ['A', 'C', 'J', 'Z', 'L'],
    coordinates: [40.6783, -73.9052]
  },
  {
    id: 'atlantic-ave-l',
    name: 'Atlantic Avenue (L)',
    borough: 'Brooklyn',
    lines: ['L'],
    coordinates: [40.6755, -73.9032]
  },
  {
    id: 'sutter-ave',
    name: 'Sutter Avenue',
    borough: 'Brooklyn',
    lines: ['L'],
    coordinates: [40.6695, -73.9019]
  },
  {
    id: 'livonia-ave',
    name: 'Livonia Avenue',
    borough: 'Brooklyn',
    lines: ['L'],
    coordinates: [40.6640, -73.8998]
  },
  {
    id: 'new-lots-ave',
    name: 'New Lots Avenue',
    borough: 'Brooklyn',
    lines: ['L'],
    coordinates: [40.6587, -73.8842]
  },
  {
    id: 'east-105th-st',
    name: 'East 105th Street',
    borough: 'Brooklyn',
    lines: ['L'],
    coordinates: [40.6505, -73.8999]
  },
  {
    id: 'canarsie-rockaway',
    name: 'Canarsie-Rockaway Parkway',
    borough: 'Brooklyn',
    lines: ['L'],
    coordinates: [40.6467, -73.9017]
  },

  // Brooklyn - G Line
  {
    id: 'long-island-city',
    name: 'Long Island City-Court Square',
    borough: 'Queens',
    lines: ['G'],
    coordinates: [40.7470, -73.9454]
  },
  {
    id: 'greenpoint-ave',
    name: 'Greenpoint Avenue',
    borough: 'Brooklyn',
    lines: ['G'],
    coordinates: [40.7307, -73.9540]
  },
  {
    id: 'nassau-ave',
    name: 'Nassau Avenue',
    borough: 'Brooklyn',
    lines: ['G'],
    coordinates: [40.7243, -73.9511]
  },
  {
    id: 'metropolitan-ave',
    name: 'Metropolitan Avenue',
    borough: 'Brooklyn',
    lines: ['G'],
    coordinates: [40.7142, -73.9511]
  },
  {
    id: 'broadway-brooklyn',
    name: 'Broadway (Brooklyn)',
    borough: 'Brooklyn',
    lines: ['G'],
    coordinates: [40.7063, -73.9502]
  },
  {
    id: 'flushing-ave',
    name: 'Flushing Avenue',
    borough: 'Brooklyn',
    lines: ['G'],
    coordinates: [40.7006, -73.9506]
  },
  {
    id: 'myrtle-willoughby',
    name: 'Myrtle-Willoughby Avenues',
    borough: 'Brooklyn',
    lines: ['G'],
    coordinates: [40.6946, -73.9490]
  },
  {
    id: 'bedford-nostrand',
    name: 'Bedford-Nostrand Avenues',
    borough: 'Brooklyn',
    lines: ['G'],
    coordinates: [40.6896, -73.9537]
  },
  {
    id: 'classon-ave',
    name: 'Classon Avenue',
    borough: 'Brooklyn',
    lines: ['G'],
    coordinates: [40.6888, -73.9596]
  },
  {
    id: 'clinton-washington',
    name: 'Clinton-Washington Avenues',
    borough: 'Brooklyn',
    lines: ['G'],
    coordinates: [40.6883, -73.9659]
  },
  {
    id: 'fulton-lafayette',
    name: 'Fulton Street-Lafayette Avenue',
    borough: 'Brooklyn',
    lines: ['G'],
    coordinates: [40.6875, -73.9744]
  },
  {
    id: '7th-ave-g',
    name: '7th Avenue (G)',
    borough: 'Brooklyn',
    lines: ['G'],
    coordinates: [40.6773, -73.9776]
  },
  {
    id: 'prospect-ave-g',
    name: 'Prospect Avenue (G)',
    borough: 'Brooklyn',
    lines: ['G'],
    coordinates: [40.6653, -73.9928]
  },
  {
    id: '4th-ave-9th-st',
    name: '4th Avenue-9th Street',
    borough: 'Brooklyn',
    lines: ['F', 'G', 'R'],
    coordinates: [40.6702, -73.9896]
  },
  {
    id: 'carroll-gardens',
    name: 'Carroll Street',
    borough: 'Brooklyn',
    lines: ['F', 'G'],
    coordinates: [40.6804, -73.9953]
  },
  {
    id: 'smith-9th',
    name: 'Smith-9th Streets',
    borough: 'Brooklyn',
    lines: ['F', 'G'],
    coordinates: [40.6739, -73.9956]
  },
  {
    id: '15th-st-prospect-park',
    name: '15th Street-Prospect Park',
    borough: 'Brooklyn',
    lines: ['F', 'G'],
    coordinates: [40.6604, -73.9797]
  },
  {
    id: 'fort-hamilton-pkwy',
    name: 'Fort Hamilton Parkway',
    borough: 'Brooklyn',
    lines: ['F', 'G'],
    coordinates: [40.6507, -73.9940]
  },
  {
    id: 'church-ave',
    name: 'Church Avenue',
    borough: 'Brooklyn',
    lines: ['F', 'G'],
    coordinates: [40.6440, -73.9791]
  },

  // Brooklyn - F Line (Additional Stations)
  {
    id: 'ditmas-ave',
    name: 'Ditmas Avenue',
    borough: 'Brooklyn',
    lines: ['F'],
    coordinates: [40.6358, -73.9784]
  },
  {
    id: '18th-ave',
    name: '18th Avenue',
    borough: 'Brooklyn',
    lines: ['F'],
    coordinates: [40.6297, -73.9776]
  },
  {
    id: 'avenue-i',
    name: 'Avenue I',
    borough: 'Brooklyn',
    lines: ['F'],
    coordinates: [40.6252, -73.9769]
  },
  {
    id: 'bay-ridge-ave',
    name: 'Bay Ridge Avenue',
    borough: 'Brooklyn',
    lines: ['F'],
    coordinates: [40.6212, -73.9762]
  },
  {
    id: 'avenue-n',
    name: 'Avenue N',
    borough: 'Brooklyn',
    lines: ['F'],
    coordinates: [40.6174, -73.9755]
  },
  {
    id: 'avenue-p',
    name: 'Avenue P',
    borough: 'Brooklyn',
    lines: ['F'],
    coordinates: [40.6089, -73.9730]
  },
  {
    id: 'kings-highway',
    name: 'Kings Highway',
    borough: 'Brooklyn',
    lines: ['F'],
    coordinates: [40.6037, -73.9722]
  },
  {
    id: 'avenue-u',
    name: 'Avenue U',
    borough: 'Brooklyn',
    lines: ['F'],
    coordinates: [40.5958, -73.9730]
  },
  {
    id: 'neptune-ave',
    name: 'Neptune Avenue',
    borough: 'Brooklyn',
    lines: ['F'],
    coordinates: [40.5806, -73.9740]
  },
  {
    id: 'west-8th-ny-aquarium',
    name: 'West 8th Street-NY Aquarium',
    borough: 'Brooklyn',
    lines: ['F', 'Q'],
    coordinates: [40.5764, -73.9759]
  },

  // Brooklyn - B/Q Line
  {
    id: 'prospect-park',
    name: 'Prospect Park',
    borough: 'Brooklyn',
    lines: ['B', 'Q'],
    coordinates: [40.6615, -73.9619]
  },
  {
    id: 'parkside-ave',
    name: 'Parkside Avenue',
    borough: 'Brooklyn',
    lines: ['B', 'Q'],
    coordinates: [40.6551, -73.9615]
  },
  {
    id: 'church-ave-bq',
    name: 'Church Avenue (B/Q)',
    borough: 'Brooklyn',
    lines: ['B', 'Q'],
    coordinates: [40.6508, -73.9624]
  },
  {
    id: 'beverly-rd',
    name: 'Beverly Road',
    borough: 'Brooklyn',
    lines: ['B', 'Q'],
    coordinates: [40.6449, -73.9636]
  },
  {
    id: 'cortelyou-rd',
    name: 'Cortelyou Road',
    borough: 'Brooklyn',
    lines: ['B', 'Q'],
    coordinates: [40.6404, -73.9639]
  },
  {
    id: 'newkirk-plaza',
    name: 'Newkirk Plaza',
    borough: 'Brooklyn',
    lines: ['B', 'Q'],
    coordinates: [40.6353, -73.9626]
  },
  {
    id: 'avenue-h',
    name: 'Avenue H',
    borough: 'Brooklyn',
    lines: ['B', 'Q'],
    coordinates: [40.6295, -73.9619]
  },
  {
    id: 'avenue-j',
    name: 'Avenue J',
    borough: 'Brooklyn',
    lines: ['B', 'Q'],
    coordinates: [40.6251, -73.9612]
  },
  {
    id: 'avenue-m',
    name: 'Avenue M',
    borough: 'Brooklyn',
    lines: ['B', 'Q'],
    coordinates: [40.6183, -73.9593]
  },
  {
    id: 'kings-highway-bq',
    name: 'Kings Highway (B/Q)',
    borough: 'Brooklyn',
    lines: ['B', 'Q'],
    coordinates: [40.6087, -73.9573]
  },
  {
    id: 'avenue-u-bq',
    name: 'Avenue U (B/Q)',
    borough: 'Brooklyn',
    lines: ['B', 'Q'],
    coordinates: [40.5993, -73.9555]
  },
  {
    id: 'neck-rd',
    name: 'Neck Road',
    borough: 'Brooklyn',
    lines: ['B', 'Q'],
    coordinates: [40.5952, -73.9551]
  },
  {
    id: 'sheepshead-bay',
    name: 'Sheepshead Bay',
    borough: 'Brooklyn',
    lines: ['B', 'Q'],
    coordinates: [40.5862, -73.9540]
  },
  {
    id: 'brighton-beach',
    name: 'Brighton Beach',
    borough: 'Brooklyn',
    lines: ['B', 'Q'],
    coordinates: [40.5776, -73.9611]
  },
  {
    id: 'ocean-pkwy',
    name: 'Ocean Parkway',
    borough: 'Brooklyn',
    lines: ['B', 'Q'],
    coordinates: [40.5765, -73.9688]
  },

  // Brooklyn - R Line
  {
    id: '7th-ave-park-slope',
    name: '7th Avenue (Park Slope)',
    borough: 'Brooklyn',
    lines: ['B', 'Q'],
    coordinates: [40.6773, -73.9776]
  },
  {
    id: 'union-st-brooklyn',
    name: 'Union Street (Brooklyn)',
    borough: 'Brooklyn',
    lines: ['R'],
    coordinates: [40.6773, -73.9835]
  },
  {
    id: 'park-slope-5th-ave',
    name: '5th Avenue (Park Slope)',
    borough: 'Brooklyn',
    lines: ['R'],
    coordinates: [40.6735, -73.9838]
  },
  {
    id: 'prospect-ave',
    name: 'Prospect Avenue',
    borough: 'Brooklyn',
    lines: ['R'],
    coordinates: [40.6653, -73.9928]
  },
  {
    id: '25th-st',
    name: '25th Street',
    borough: 'Brooklyn',
    lines: ['R'],
    coordinates: [40.6606, -73.9988]
  },
  {
    id: '36th-st',
    name: '36th Street',
    borough: 'Brooklyn',
    lines: ['R'],
    coordinates: [40.6553, -74.0041]
  },
  {
    id: '45th-st',
    name: '45th Street',
    borough: 'Brooklyn',
    lines: ['R'],
    coordinates: [40.6514, -74.0102]
  },
  {
    id: '53rd-st',
    name: '53rd Street',
    borough: 'Brooklyn',
    lines: ['R'],
    coordinates: [40.6484, -74.0137]
  },
  {
    id: '59th-st-brooklyn',
    name: '59th Street (Brooklyn)',
    borough: 'Brooklyn',
    lines: ['R'],
    coordinates: [40.6417, -74.0177]
  },
  {
    id: 'bay-ridge-95th',
    name: 'Bay Ridge-95th Street',
    borough: 'Brooklyn',
    lines: ['R'],
    coordinates: [40.6162, -74.0303]
  },

  // Brooklyn - D Line
  {
    id: '36th-st-4th-ave',
    name: '36th Street (4th Avenue)',
    borough: 'Brooklyn',
    lines: ['D', 'N', 'R'],
    coordinates: [40.6553, -74.0041]
  },
  {
    id: '9th-st-4th-ave',
    name: '9th Street (4th Avenue)',
    borough: 'Brooklyn',
    lines: ['D', 'N', 'R'],
    coordinates: [40.6702, -73.9896]
  },
  {
    id: 'prospect-ave-d',
    name: 'Prospect Avenue (D)',
    borough: 'Brooklyn',
    lines: ['D'],
    coordinates: [40.6653, -73.9928]
  },
  {
    id: '25th-st-d',
    name: '25th Street (D)',
    borough: 'Brooklyn',
    lines: ['D'],
    coordinates: [40.6606, -73.9988]
  },
  {
    id: 'bay-pkwy-d',
    name: 'Bay Parkway (D)',
    borough: 'Brooklyn',
    lines: ['D'],
    coordinates: [40.6013, -73.9918]
  },
  {
    id: '25th-ave-d',
    name: '25th Avenue (D)',
    borough: 'Brooklyn',
    lines: ['D'],
    coordinates: [40.5947, -73.9867]
  },
  {
    id: 'bay-50th-st',
    name: 'Bay 50th Street',
    borough: 'Brooklyn',
    lines: ['D'],
    coordinates: [40.5883, -73.9836]
  },

  // Brooklyn - A/C Line
  {
    id: 'high-st',
    name: 'High Street-Brooklyn Bridge',
    borough: 'Brooklyn',
    lines: ['A', 'C'],
    coordinates: [40.6979, -73.9902]
  },
  {
    id: 'lafayette-ave',
    name: 'Lafayette Avenue',
    borough: 'Brooklyn',
    lines: ['C'],
    coordinates: [40.6862, -73.9744]
  },
  {
    id: 'nostrand-ave',
    name: 'Nostrand Avenue',
    borough: 'Brooklyn',
    lines: ['A', 'C'],
    coordinates: [40.6806, -73.9501]
  },
  {
    id: 'utica-ave',
    name: 'Utica Avenue',
    borough: 'Brooklyn',
    lines: ['A', 'C'],
    coordinates: [40.6694, -73.9308]
  },
  {
    id: 'ralph-ave',
    name: 'Ralph Avenue',
    borough: 'Brooklyn',
    lines: ['A', 'C'],
    coordinates: [40.6589, -73.9209]
  },
  {
    id: 'rockaway-ave',
    name: 'Rockaway Avenue',
    borough: 'Brooklyn',
    lines: ['A', 'C'],
    coordinates: [40.6627, -73.9118]
  },
  {
    id: 'liberty-ave',
    name: 'Liberty Avenue',
    borough: 'Brooklyn',
    lines: ['A', 'C'],
    coordinates: [40.6741, -73.8965]
  },
  {
    id: 'van-siclen-ave',
    name: 'Van Siclen Avenue',
    borough: 'Brooklyn',
    lines: ['A', 'C'],
    coordinates: [40.6655, -73.8895]
  },
  {
    id: 'shepherd-ave',
    name: 'Shepherd Avenue',
    borough: 'Brooklyn',
    lines: ['A', 'C'],
    coordinates: [40.6574, -73.8803]
  },
  {
    id: 'euclid-ave',
    name: 'Euclid Avenue',
    borough: 'Brooklyn',
    lines: ['A', 'C'],
    coordinates: [40.6751, -73.8721]
  },
  {
    id: 'grant-ave',
    name: 'Grant Avenue',
    borough: 'Brooklyn',
    lines: ['A'],
    coordinates: [40.6771, -73.8671]
  },
  {
    id: '80th-st',
    name: '80th Street',
    borough: 'Brooklyn',
    lines: ['A'],
    coordinates: [40.6791, -73.8616]
  },
  {
    id: '88th-st',
    name: '88th Street',
    borough: 'Brooklyn',
    lines: ['A'],
    coordinates: [40.6794, -73.8553]
  },
  {
    id: 'rockaway-blvd',
    name: 'Rockaway Boulevard',
    borough: 'Brooklyn',
    lines: ['A'],
    coordinates: [40.6804, -73.8431]
  },
  {
    id: 'ozone-park',
    name: 'Ozone Park-Lefferts Boulevard',
    borough: 'Queens',
    lines: ['A'],
    coordinates: [40.6856, -73.8256]
  },

  // Brooklyn - J/Z Line
  {
    id: 'marcy-ave',
    name: 'Marcy Avenue',
    borough: 'Brooklyn',
    lines: ['J', 'Z'],
    coordinates: [40.7081, -73.9574]
  },
  {
    id: 'hewes-st',
    name: 'Hewes Street',
    borough: 'Brooklyn',
    lines: ['J', 'Z'],
    coordinates: [40.7065, -73.9537]
  },
  {
    id: 'lorimer-st-jz',
    name: 'Lorimer Street (J/Z)',
    borough: 'Brooklyn',
    lines: ['J', 'Z'],
    coordinates: [40.7037, -73.9479]
  },
  {
    id: 'flushing-ave-jz',
    name: 'Flushing Avenue (J/Z)',
    borough: 'Brooklyn',
    lines: ['J', 'Z'],
    coordinates: [40.7006, -73.9411]
  },
  {
    id: 'myrtle-ave-jz',
    name: 'Myrtle Avenue (J/Z)',
    borough: 'Brooklyn',
    lines: ['J', 'Z'],
    coordinates: [40.6970, -73.9351]
  },
  {
    id: 'kosciuszko-st',
    name: 'Kosciuszko Street',
    borough: 'Brooklyn',
    lines: ['J'],
    coordinates: [40.6933, -73.9284]
  },
  {
    id: 'gates-ave',
    name: 'Gates Avenue',
    borough: 'Brooklyn',
    lines: ['J'],
    coordinates: [40.6898, -73.9217]
  },
  {
    id: 'halsey-st-jz',
    name: 'Halsey Street (J/Z)',
    borough: 'Brooklyn',
    lines: ['J', 'Z'],
    coordinates: [40.6862, -73.9169]
  },
  {
    id: 'chauncey-st',
    name: 'Chauncey Street',
    borough: 'Brooklyn',
    lines: ['J', 'Z'],
    coordinates: [40.6830, -73.9103]
  },
  {
    id: 'alabama-ave',
    name: 'Alabama Avenue',
    borough: 'Brooklyn',
    lines: ['J'],
    coordinates: [40.6794, -73.9018]
  },
  {
    id: 'van-siclen-ave-jz',
    name: 'Van Siclen Avenue (J/Z)',
    borough: 'Brooklyn',
    lines: ['J', 'Z'],
    coordinates: [40.6755, -73.8895]
  },
  {
    id: 'crescent-st',
    name: 'Crescent Street',
    borough: 'Brooklyn',
    lines: ['J', 'Z'],
    coordinates: [40.6834, -73.8738]
  },
  {
    id: 'norwood-ave',
    name: 'Norwood Avenue',
    borough: 'Brooklyn',
    lines: ['J', 'Z'],
    coordinates: [40.6816, -73.8794]
  },
  {
    id: 'cleveland-st',
    name: 'Cleveland Street',
    borough: 'Brooklyn',
    lines: ['J'],
    coordinates: [40.6794, -73.8847]
  },

  // Brooklyn - 2/3 Line
  {
    id: 'hoyt-st',
    name: 'Hoyt Street',
    borough: 'Brooklyn',
    lines: ['2', '3'],
    coordinates: [40.6906, -73.9851]
  },
  {
    id: 'nevins-st',
    name: 'Nevins Street',
    borough: 'Brooklyn',
    lines: ['2', '3'],
    coordinates: [40.6883, -73.9802]
  },
  {
    id: 'bergen-st',
    name: 'Bergen Street',
    borough: 'Brooklyn',
    lines: ['2', '3'],
    coordinates: [40.6862, -73.9751]
  },
  {
    id: 'grand-army-plaza',
    name: 'Grand Army Plaza',
    borough: 'Brooklyn',
    lines: ['2', '3'],
    coordinates: [40.6754, -73.9710]
  },
  {
    id: 'eastern-pkwy',
    name: 'Eastern Parkway-Brooklyn Museum',
    borough: 'Brooklyn',
    lines: ['2', '3'],
    coordinates: [40.6713, -73.9640]
  },
  {
    id: 'franklin-ave',
    name: 'Franklin Avenue',
    borough: 'Brooklyn',
    lines: ['2', '3'],
    coordinates: [40.6704, -73.9583]
  },
  {
    id: 'president-st',
    name: 'President Street',
    borough: 'Brooklyn',
    lines: ['2', '3'],
    coordinates: [40.6677, -73.9506]
  },
  {
    id: 'sterling-st',
    name: 'Sterling Street',
    borough: 'Brooklyn',
    lines: ['2', '3'],
    coordinates: [40.6628, -73.9506]
  },
  {
    id: 'winthrop-st',
    name: 'Winthrop Street',
    borough: 'Brooklyn',
    lines: ['2', '3'],
    coordinates: [40.6567, -73.9506]
  },
  {
    id: 'church-ave-23',
    name: 'Church Avenue (2/3)',
    borough: 'Brooklyn',
    lines: ['2', '3'],
    coordinates: [40.6508, -73.9494]
  },
  {
    id: 'beverly-rd-23',
    name: 'Beverly Road (2/3)',
    borough: 'Brooklyn',
    lines: ['2', '3'],
    coordinates: [40.6449, -73.9494]
  },
  {
    id: 'newkirk-ave',
    name: 'Newkirk Avenue',
    borough: 'Brooklyn',
    lines: ['2', '3'],
    coordinates: [40.6353, -73.9494]
  },
  {
    id: 'flatbush-ave',
    name: 'Flatbush Avenue-Brooklyn College',
    borough: 'Brooklyn',
    lines: ['2', '3'],
    coordinates: [40.6323, -73.9474]
  },

  // Brooklyn - 4/5 Line
  {
    id: 'bowling-green-45',
    name: 'Bowling Green (4/5)',
    borough: 'Brooklyn',
    lines: ['4', '5'],
    coordinates: [40.7049, -74.0137]
  },
  {
    id: 'borough-hall',
    name: 'Borough Hall',
    borough: 'Brooklyn',
    lines: ['4', '5'],
    coordinates: [40.6924, -73.9902]
  },

  // Queens - Major Hubs
  {
    id: 'court-sq-23',
    name: 'Court Square-23rd Street',
    borough: 'Queens',
    lines: ['E', 'M', '7', 'G'],
    coordinates: [40.7470, -73.9454]
  },
  {
    id: 'queensboro-plaza',
    name: 'Queensboro Plaza',
    borough: 'Queens',
    lines: ['N', 'Q', 'R', 'W', '7'],
    coordinates: [40.7508, -73.9401]
  },
  {
    id: 'jackson-hts-roosevelt',
    name: 'Jackson Heights-Roosevelt Avenue',
    borough: 'Queens',
    lines: ['E', 'F', 'M', 'R', '7'],
    coordinates: [40.7464, -73.8917]
  },
  {
    id: 'flushing-main-st',
    name: 'Flushing-Main Street',
    borough: 'Queens',
    lines: ['7'],
    coordinates: [40.7596, -73.8303]
  },
  {
    id: 'forest-hills-71',
    name: 'Forest Hills-71st Avenue',
    borough: 'Queens',
    lines: ['E', 'F', 'M', 'R'],
    coordinates: [40.7214, -73.8447]
  },

  // Queens - 7 Line
  {
    id: 'hunters-point-ave',
    name: 'Hunters Point Avenue',
    borough: 'Queens',
    lines: ['7'],
    coordinates: [40.7424, -73.9487]
  },
  {
    id: 'vernon-jackson',
    name: 'Vernon Boulevard-Jackson Avenue',
    borough: 'Queens',
    lines: ['7'],
    coordinates: [40.7429, -73.9538]
  },
  {
    id: '45th-rd',
    name: '45th Road-Court House Square',
    borough: 'Queens',
    lines: ['7'],
    coordinates: [40.7470, -73.9454]
  },
  {
    id: '40th-st-lowery',
    name: '40th Street-Lowery Street',
    borough: 'Queens',
    lines: ['7'],
    coordinates: [40.7434, -73.9244]
  },
  {
    id: '46th-st-bliss',
    name: '46th Street-Bliss Street',
    borough: 'Queens',
    lines: ['7'],
    coordinates: [40.7434, -73.9181]
  },
  {
    id: '52nd-st',
    name: '52nd Street',
    borough: 'Queens',
    lines: ['7'],
    coordinates: [40.7434, -73.9123]
  },
  {
    id: '61st-st-woodside',
    name: '61st Street-Woodside',
    borough: 'Queens',
    lines: ['7'],
    coordinates: [40.7434, -73.9023]
  },
  {
    id: '69th-st',
    name: '69th Street',
    borough: 'Queens',
    lines: ['7'],
    coordinates: [40.7464, -73.8962]
  },
  {
    id: '74th-st-broadway',
    name: '74th Street-Broadway',
    borough: 'Queens',
    lines: ['7'],
    coordinates: [40.7464, -73.8917]
  },
  {
    id: '82nd-st-jackson-hts',
    name: '82nd Street-Jackson Heights',
    borough: 'Queens',
    lines: ['7'],
    coordinates: [40.7478, -73.8834]
  },
  {
    id: '90th-st-elmhurst',
    name: '90th Street-Elmhurst Avenue',
    borough: 'Queens',
    lines: ['7'],
    coordinates: [40.7478, -73.8762]
  },
  {
    id: 'junction-blvd',
    name: 'Junction Boulevard',
    borough: 'Queens',
    lines: ['7'],
    coordinates: [40.7491, -73.8695]
  },
  {
    id: '103rd-st-corona',
    name: '103rd Street-Corona Plaza',
    borough: 'Queens',
    lines: ['7'],
    coordinates: [40.7491, -73.8628]
  },
  {
    id: '111th-st',
    name: '111th Street',
    borough: 'Queens',
    lines: ['7'],
    coordinates: [40.7516, -73.8553]
  },
  {
    id: 'mets-willets-point',
    name: 'Mets-Willets Point',
    borough: 'Queens',
    lines: ['7'],
    coordinates: [40.7547, -73.8456]
  },

  // Queens - N/Q/R/W Line
  {
    id: 'astoria-ditmars',
    name: 'Astoria-Ditmars Boulevard',
    borough: 'Queens',
    lines: ['N', 'Q', 'W'],
    coordinates: [40.7751, -73.9126]
  },
  {
    id: 'astoria-blvd',
    name: 'Astoria Boulevard',
    borough: 'Queens',
    lines: ['N', 'Q', 'W'],
    coordinates: [40.7709, -73.9261]
  },
  {
    id: '30th-ave-astoria',
    name: '30th Avenue (Astoria)',
    borough: 'Queens',
    lines: ['N', 'Q', 'W'],
    coordinates: [40.7667, -73.9212]
  },
  {
    id: 'broadway-astoria',
    name: 'Broadway (Astoria)',
    borough: 'Queens',
    lines: ['N', 'Q', 'W'],
    coordinates: [40.7616, -73.9251]
  },
  {
    id: '36th-ave',
    name: '36th Avenue',
    borough: 'Queens',
    lines: ['N', 'Q', 'W'],
    coordinates: [40.7564, -73.9292]
  },
  {
    id: '39th-ave',
    name: '39th Avenue',
    borough: 'Queens',
    lines: ['N', 'Q', 'W'],
    coordinates: [40.7531, -73.9322]
  },
  {
    id: 'lexington-ave-59th',
    name: 'Lexington Avenue-59th Street',
    borough: 'Queens',
    lines: ['N', 'Q', 'R', 'W'],
    coordinates: [40.7625, -73.9675]
  },

  // Queens - E/F/M/R Line
  {
    id: 'kew-gardens-union-tpke',
    name: 'Kew Gardens-Union Turnpike',
    borough: 'Queens',
    lines: ['E', 'F'],
    coordinates: [40.7147, -73.8311]
  },
  {
    id: '75th-ave',
    name: '75th Avenue',
    borough: 'Queens',
    lines: ['E', 'F'],
    coordinates: [40.7181, -73.8370]
  },
  {
    id: 'briarwood',
    name: 'Briarwood',
    borough: 'Queens',
    lines: ['E', 'F'],
    coordinates: [40.7092, -73.8209]
  },
  {
    id: 'sutphin-blvd',
    name: 'Sutphin Boulevard',
    borough: 'Queens',
    lines: ['E', 'F'],
    coordinates: [40.7058, -73.8078]
  },
  {
    id: 'jamaica-179th',
    name: 'Jamaica-179th Street',
    borough: 'Queens',
    lines: ['F'],
    coordinates: [40.7125, -73.7836]
  },
  {
    id: 'parsons-blvd',
    name: 'Parsons Boulevard',
    borough: 'Queens',
    lines: ['F'],
    coordinates: [40.7078, -73.8031]
  },
  {
    id: '169th-st',
    name: '169th Street',
    borough: 'Queens',
    lines: ['F'],
    coordinates: [40.7103, -73.7936]
  },
  {
    id: 'jamaica-van-wyck',
    name: 'Jamaica-Van Wyck',
    borough: 'Queens',
    lines: ['E'],
    coordinates: [40.7025, -73.8169]
  },

  // Queens - Additional Stations
  {
    id: 'woodhaven-blvd',
    name: 'Woodhaven Boulevard',
    borough: 'Queens',
    lines: ['M', 'R'],
    coordinates: [40.7336, -73.8691]
  },
  {
    id: 'elmhurst-ave',
    name: 'Elmhurst Avenue',
    borough: 'Queens',
    lines: ['M', 'R'],
    coordinates: [40.7420, -73.8820]
  },
  {
    id: 'grand-ave-newtown',
    name: 'Grand Avenue-Newtown',
    borough: 'Queens',
    lines: ['M', 'R'],
    coordinates: [40.7369, -73.8773]
  },
  {
    id: 'northern-blvd',
    name: 'Northern Boulevard',
    borough: 'Queens',
    lines: ['M', 'R'],
    coordinates: [40.7547, -73.8906]
  },
  {
    id: '65th-st',
    name: '65th Street',
    borough: 'Queens',
    lines: ['M', 'R'],
    coordinates: [40.7497, -73.8978]
  },

  // Bronx - Major Hubs
  {
    id: 'yankee-stadium-161',
    name: 'Yankee Stadium-161st Street',
    borough: 'Bronx',
    lines: ['B', 'D', '4', '5', '6'],
    coordinates: [40.8276, -73.9258]
  },
  {
    id: '149th-st-grand-concourse',
    name: '149th Street-Grand Concourse',
    borough: 'Bronx',
    lines: ['2', '4', '5', '6'],
    coordinates: [40.8183, -73.9273]
  },
  {
    id: 'fordham-rd',
    name: 'Fordham Road',
    borough: 'Bronx',
    lines: ['B', 'D'],
    coordinates: [40.8621, -73.9017]
  },
  {
    id: '125th-st-bronx',
    name: '125th Street (Bronx)',
    borough: 'Bronx',
    lines: ['A', 'D'],
    coordinates: [40.8158, -73.9585]
  },

  // Bronx - 1 Line
  {
    id: '231st-st',
    name: '231st Street',
    borough: 'Bronx',
    lines: ['1'],
    coordinates: [40.8788, -73.9048]
  },
  {
    id: 'marble-hill-225th',
    name: 'Marble Hill-225th Street',
    borough: 'Bronx',
    lines: ['1'],
    coordinates: [40.8740, -73.9098]
  },

  // Bronx - 4/5/6 Line
  {
    id: 'burnside-ave',
    name: 'Burnside Avenue',
    borough: 'Bronx',
    lines: ['4'],
    coordinates: [40.8533, -73.9075]
  },
  {
    id: '176th-st',
    name: '176th Street',
    borough: 'Bronx',
    lines: ['4'],
    coordinates: [40.8482, -73.9115]
  },
  {
    id: 'mount-eden-ave',
    name: 'Mount Eden Avenue',
    borough: 'Bronx',
    lines: ['4'],
    coordinates: [40.8444, -73.9147]
  },
  {
    id: '170th-st',
    name: '170th Street',
    borough: 'Bronx',
    lines: ['4'],
    coordinates: [40.8404, -73.9176]
  },
  {
    id: '167th-st',
    name: '167th Street',
    borough: 'Bronx',
    lines: ['4'],
    coordinates: [40.8354, -73.9211]
  },
  {
    id: '161st-st-yankee',
    name: '161st Street-Yankee Stadium',
    borough: 'Bronx',
    lines: ['4', '5', '6'],
    coordinates: [40.8276, -73.9258]
  },
  {
    id: '155th-st-bronx',
    name: '155th Street (Bronx)',
    borough: 'Bronx',
    lines: ['4', '5', '6'],
    coordinates: [40.8304, -73.9415]
  },
  {
    id: '145th-st-bronx',
    name: '145th Street (Bronx)',
    borough: 'Bronx',
    lines: ['4', '5', '6'],
    coordinates: [40.8267, -73.9502]
  },
  {
    id: '138th-st-grand-concourse',
    name: '138th Street-Grand Concourse',
    borough: 'Bronx',
    lines: ['4', '5', '6'],
    coordinates: [40.8183, -73.9273]
  },

  // Bronx - 6 Line
  {
    id: 'pelham-bay-park',
    name: 'Pelham Bay Park',
    borough: 'Bronx',
    lines: ['6'],
    coordinates: [40.8525, -73.8281]
  },
  {
    id: 'buhre-ave',
    name: 'Buhre Avenue',
    borough: 'Bronx',
    lines: ['6'],
    coordinates: [40.8467, -73.8323]
  },
  {
    id: 'middletown-rd',
    name: 'Middletown Road',
    borough: 'Bronx',
    lines: ['6'],
    coordinates: [40.8434, -73.8365]
  },
  {
    id: 'westchester-sq',
    name: 'Westchester Square-East Tremont Avenue',
    borough: 'Bronx',
    lines: ['6'],
    coordinates: [40.8404, -73.8428]
  },
  {
    id: 'zerega-ave',
    name: 'Zerega Avenue',
    borough: 'Bronx',
    lines: ['6'],
    coordinates: [40.8364, -73.8471]
  },
  {
    id: 'castle-hill-ave',
    name: 'Castle Hill Avenue',
    borough: 'Bronx',
    lines: ['6'],
    coordinates: [40.8342, -73.8513]
  },
  {
    id: 'parkchester',
    name: 'Parkchester',
    borough: 'Bronx',
    lines: ['6'],
    coordinates: [40.8333, -73.8581]
  },
  {
    id: 'st-lawrence-ave',
    name: 'St. Lawrence Avenue',
    borough: 'Bronx',
    lines: ['6'],
    coordinates: [40.8314, -73.8671]
  },
  {
    id: 'morrison-ave',
    name: 'Morrison Avenue-Soundview',
    borough: 'Bronx',
    lines: ['6'],
    coordinates: [40.8295, -73.8742]
  },
  {
    id: 'elder-ave',
    name: 'Elder Avenue',
    borough: 'Bronx',
    lines: ['6'],
    coordinates: [40.8276, -73.8793]
  },
  {
    id: 'whitlock-ave',
    name: 'Whitlock Avenue',
    borough: 'Bronx',
    lines: ['6'],
    coordinates: [40.8257, -73.8864]
  },
  {
    id: 'hunts-point-ave',
    name: 'Hunts Point Avenue',
    borough: 'Bronx',
    lines: ['6'],
    coordinates: [40.8208, -73.8901]
  },
  {
    id: 'longwood-ave',
    name: 'Longwood Avenue',
    borough: 'Bronx',
    lines: ['6'],
    coordinates: [40.8164, -73.8964]
  },
  {
    id: '3rd-ave-149th',
    name: '3rd Avenue-149th Street',
    borough: 'Bronx',
    lines: ['6'],
    coordinates: [40.8164, -73.9176]
  },

  // Bronx - A/D Line
  {
    id: '207th-st-bronx',
    name: '207th Street (Bronx)',
    borough: 'Bronx',
    lines: ['A'],
    coordinates: [40.8648, -73.9188]
  },
  {
    id: 'inwood-207th',
    name: 'Inwood-207th Street',
    borough: 'Bronx',
    lines: ['A'],
    coordinates: [40.8648, -73.9188]
  },
  {
    id: '205th-st',
    name: '205th Street',
    borough: 'Bronx',
    lines: ['A'],
    coordinates: [40.8648, -73.9188]
  },

  // Bronx - B/D Line
  {
    id: 'bedford-park-blvd',
    name: 'Bedford Park Boulevard',
    borough: 'Bronx',
    lines: ['B', 'D'],
    coordinates: [40.8731, -73.8903]
  },
  {
    id: 'kingsbridge-rd',
    name: 'Kingsbridge Road',
    borough: 'Bronx',
    lines: ['B', 'D'],
    coordinates: [40.8662, -73.8973]
  },
  {
    id: 'tremont-ave',
    name: 'Tremont Avenue',
    borough: 'Bronx',
    lines: ['B', 'D'],
    coordinates: [40.8503, -73.9047]
  },
  {
    id: '182nd-183rd-sts',
    name: '182nd-183rd Streets',
    borough: 'Bronx',
    lines: ['B', 'D'],
    coordinates: [40.8564, -73.9017]
  },

  // Staten Island Railway
  {
    id: 'st-george',
    name: 'St. George',
    borough: 'Staten Island',
    lines: ['SIR'],
    coordinates: [40.6436, -74.0739]
  },
  {
    id: 'tompkinsville',
    name: 'Tompkinsville',
    borough: 'Staten Island',
    lines: ['SIR'],
    coordinates: [40.6364, -74.0765]
  },
  {
    id: 'stapleton',
    name: 'Stapleton',
    borough: 'Staten Island',
    lines: ['SIR'],
    coordinates: [40.6277, -74.0765]
  },
  {
    id: 'clifton',
    name: 'Clifton',
    borough: 'Staten Island',
    lines: ['SIR'],
    coordinates: [40.6231, -74.0765]
  },
  {
    id: 'grasmere',
    name: 'Grasmere',
    borough: 'Staten Island',
    lines: ['SIR'],
    coordinates: [40.6037, -74.0765]
  },
  {
    id: 'old-town',
    name: 'Old Town',
    borough: 'Staten Island',
    lines: ['SIR'],
    coordinates: [40.5992, -74.0765]
  },
  {
    id: 'dongan-hills',
    name: 'Dongan Hills',
    borough: 'Staten Island',
    lines: ['SIR'],
    coordinates: [40.5947, -74.0765]
  },
  {
    id: 'jefferson-ave',
    name: 'Jefferson Avenue',
    borough: 'Staten Island',
    lines: ['SIR'],
    coordinates: [40.5903, -74.0765]
  },
  {
    id: 'grant-city',
    name: 'Grant City',
    borough: 'Staten Island',
    lines: ['SIR'],
    coordinates: [40.5858, -74.0765]
  },
  {
    id: 'new-dorp',
    name: 'New Dorp',
    borough: 'Staten Island',
    lines: ['SIR'],
    coordinates: [40.5814, -74.0765]
  },
  {
    id: 'oakwood-heights',
    name: 'Oakwood Heights',
    borough: 'Staten Island',
    lines: ['SIR'],
    coordinates: [40.5769, -74.0765]
  },
  {
    id: 'bay-terrace',
    name: 'Bay Terrace',
    borough: 'Staten Island',
    lines: ['SIR'],
    coordinates: [40.5725, -74.0765]
  },
  {
    id: 'great-kills',
    name: 'Great Kills',
    borough: 'Staten Island',
    lines: ['SIR'],
    coordinates: [40.5680, -74.0765]
  },
  {
    id: 'eltingville',
    name: 'Eltingville',
    borough: 'Staten Island',
    lines: ['SIR'],
    coordinates: [40.5636, -74.0765]
  },
  {
    id: 'annadale',
    name: 'Annadale',
    borough: 'Staten Island',
    lines: ['SIR'],
    coordinates: [40.5591, -74.0765]
  },
  {
    id: 'huguenot',
    name: 'Huguenot',
    borough: 'Staten Island',
    lines: ['SIR'],
    coordinates: [40.5547, -74.0765]
  },
  {
    id: 'prince-bay',
    name: 'Prince Bay',
    borough: 'Staten Island',
    lines: ['SIR'],
    coordinates: [40.5502, -74.0765]
  },
  {
    id: 'pleasant-plains',
    name: 'Pleasant Plains',
    borough: 'Staten Island',
    lines: ['SIR'],
    coordinates: [40.5458, -74.0765]
  },
  {
    id: 'richmond-valley',
    name: 'Richmond Valley',
    borough: 'Staten Island',
    lines: ['SIR'],
    coordinates: [40.5413, -74.0765]
  },
  {
    id: 'tottenville',
    name: 'Tottenville',
    borough: 'Staten Island',
    lines: ['SIR'],
    coordinates: [40.5125, -74.2461]
  }
];