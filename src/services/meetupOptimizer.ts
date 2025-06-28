import { Station } from '../types';
import { MTA_STATIONS } from './mta/stations';

interface OptimizationOptions {
  person1Name: string;
  person2Name: string;
  preferredMeetTime: Date;
  maxTravelTime: number; // minutes
  avoidTransfers: boolean;
}

interface RouteInfo {
  fromStation: Station;
  toStation: Station;
  estimatedTravelTime: number; // minutes
  suggestedLines: string[];
  transfers?: number;
}

interface OptimizationResult {
  meetingStation: Station;
  person1Route: RouteInfo;
  person2Route: RouteInfo;
  estimatedMeetTime: Date;
  reasoning: string;
  score: number; // 0-100, higher is better
}

class MeetupOptimizer {
  // Calculate distance between two coordinates (Haversine formula)
  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.toRadians(lat2 - lat1);
    const dLon = this.toRadians(lon2 - lon1);
    
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(this.toRadians(lat1)) * Math.cos(this.toRadians(lat2)) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  // Find common lines between two stations
  private findCommonLines(station1: Station, station2: Station): string[] {
    return station1.lines.filter(line => station2.lines.includes(line));
  }

  // Estimate travel time between two stations
  private estimateTravelTime(from: Station, to: Station): { time: number; lines: string[]; transfers: number } {
    const distance = this.calculateDistance(
      from.coordinates[0], from.coordinates[1],
      to.coordinates[0], to.coordinates[1]
    );

    // Find common lines (direct route)
    const commonLines = this.findCommonLines(from, to);
    
    if (commonLines.length > 0) {
      // Direct route available
      const baseTime = Math.max(5, Math.round(distance * 3)); // ~3 minutes per km minimum 5 min
      return {
        time: baseTime,
        lines: commonLines.slice(0, 2), // Take up to 2 best options
        transfers: 0
      };
    }

    // Need transfer - find intermediate stations
    const intermediateStations = this.findTransferStations(from, to);
    
    if (intermediateStations.length > 0) {
      const bestTransfer = intermediateStations[0];
      const leg1Time = this.estimateTravelTime(from, bestTransfer.station);
      const leg2Time = this.estimateTravelTime(bestTransfer.station, to);
      
      return {
        time: leg1Time.time + leg2Time.time + 5, // Add 5 minutes for transfer
        lines: [...leg1Time.lines, ...leg2Time.lines].slice(0, 3),
        transfers: 1
      };
    }

    // Fallback: estimate based on distance
    const fallbackTime = Math.max(10, Math.round(distance * 4));
    return {
      time: fallbackTime,
      lines: [...from.lines, ...to.lines].slice(0, 2),
      transfers: 1
    };
  }

  // Find potential transfer stations between two stations
  private findTransferStations(from: Station, to: Station): Array<{ station: Station; score: number }> {
    const transferStations: Array<{ station: Station; score: number }> = [];

    for (const station of MTA_STATIONS) {
      if (station.id === from.id || station.id === to.id) continue;

      const hasConnectionToFrom = this.findCommonLines(from, station).length > 0;
      const hasConnectionToTo = this.findCommonLines(station, to).length > 0;

      if (hasConnectionToFrom && hasConnectionToTo) {
        // Calculate score based on distance and line connectivity
        const distanceFromStart = this.calculateDistance(
          from.coordinates[0], from.coordinates[1],
          station.coordinates[0], station.coordinates[1]
        );
        const distanceToEnd = this.calculateDistance(
          station.coordinates[0], station.coordinates[1],
          to.coordinates[0], to.coordinates[1]
        );

        const totalDistance = distanceFromStart + distanceToEnd;
        const directDistance = this.calculateDistance(
          from.coordinates[0], from.coordinates[1],
          to.coordinates[0], to.coordinates[1]
        );

        // Prefer transfers that don't add too much distance
        const efficiency = directDistance / totalDistance;
        const lineConnectivity = station.lines.length; // More lines = better transfer hub

        const score = efficiency * 50 + lineConnectivity * 5;
        transferStations.push({ station, score });
      }
    }

    return transferStations.sort((a, b) => b.score - a.score).slice(0, 5);
  }

  // Find potential meeting stations between two starting points
  private findPotentialMeetingStations(station1: Station, station2: Station): Station[] {
    const candidates: Array<{ station: Station; score: number }> = [];

    // Calculate midpoint
    const midLat = (station1.coordinates[0] + station2.coordinates[0]) / 2;
    const midLon = (station1.coordinates[1] + station2.coordinates[1]) / 2;

    for (const station of MTA_STATIONS) {
      if (station.id === station1.id || station.id === station2.id) continue;

      // Distance from midpoint (prefer central locations)
      const distanceFromMidpoint = this.calculateDistance(midLat, midLon, station.coordinates[0], station.coordinates[1]);
      
      // Distance from both starting points
      const dist1 = this.calculateDistance(
        station1.coordinates[0], station1.coordinates[1],
        station.coordinates[0], station.coordinates[1]
      );
      const dist2 = this.calculateDistance(
        station2.coordinates[0], station2.coordinates[1],
        station.coordinates[0], station.coordinates[1]
      );

      // Prefer stations that are:
      // 1. Close to the midpoint
      // 2. Roughly equidistant from both starting points
      // 3. Well-connected (many lines)
      // 4. In Manhattan (major hub)
      
      const maxDistance = Math.max(dist1, dist2);
      const distanceBalance = 1 - Math.abs(dist1 - dist2) / (dist1 + dist2);
      const connectivity = station.lines.length;
      const isManhattan = station.borough === 'Manhattan' ? 1.2 : 1.0;
      
      // Penalize very far stations
      if (maxDistance > 15) continue; // Skip stations more than 15km away
      
      const score = (
        (1 / (distanceFromMidpoint + 1)) * 30 +  // Prefer central locations
        distanceBalance * 40 +                    // Prefer balanced distances
        connectivity * 5 +                        // Prefer well-connected stations
        isManhattan * 10                          // Slight preference for Manhattan
      ) / maxDistance; // Normalize by distance

      candidates.push({ station, score });
    }

    return candidates
      .sort((a, b) => b.score - a.score)
      .slice(0, 10)
      .map(c => c.station);
  }

  // Use AI-like reasoning to select the best meeting point
  async findOptimalMeetingPoint(
    station1: Station,
    station2: Station,
    options: OptimizationOptions
  ): Promise<OptimizationResult> {
    
    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    const potentialStations = this.findPotentialMeetingStations(station1, station2);
    
    if (potentialStations.length === 0) {
      throw new Error('No suitable meeting points found between the selected stations');
    }

    let bestResult: OptimizationResult | null = null;
    let bestScore = 0;

    for (const meetingStation of potentialStations) {
      // Calculate routes for both people
      const route1 = this.estimateTravelTime(station1, meetingStation);
      const route2 = this.estimateTravelTime(station2, meetingStation);

      // Skip if travel time exceeds maximum
      if (route1.time > options.maxTravelTime || route2.time > options.maxTravelTime) {
        continue;
      }

      // Calculate when they would meet
      const maxTravelTime = Math.max(route1.time, route2.time);
      const estimatedMeetTime = new Date(options.preferredMeetTime.getTime() + maxTravelTime * 60 * 1000);

      // Score this option
      const timeDifference = Math.abs(route1.time - route2.time);
      const avgTravelTime = (route1.time + route2.time) / 2;
      const totalTransfers = route1.transfers + route2.transfers;
      
      // Scoring factors
      const timeBalance = Math.max(0, 100 - timeDifference * 5); // Prefer similar travel times
      const efficiency = Math.max(0, 100 - avgTravelTime * 2); // Prefer shorter travel times
      const transferPenalty = options.avoidTransfers ? totalTransfers * 20 : totalTransfers * 10;
      const connectivity = meetingStation.lines.length * 3; // Prefer well-connected stations
      const hubBonus = this.isTransitHub(meetingStation) ? 15 : 0;

      const score = timeBalance + efficiency - transferPenalty + connectivity + hubBonus;

      if (score > bestScore) {
        bestScore = score;
        bestResult = {
          meetingStation,
          person1Route: {
            fromStation: station1,
            toStation: meetingStation,
            estimatedTravelTime: route1.time,
            suggestedLines: route1.lines,
            transfers: route1.transfers
          },
          person2Route: {
            fromStation: station2,
            toStation: meetingStation,
            estimatedTravelTime: route2.time,
            suggestedLines: route2.lines,
            transfers: route2.transfers
          },
          estimatedMeetTime,
          reasoning: this.generateReasoning(meetingStation, route1, route2, timeDifference),
          score
        };
      }
    }

    if (!bestResult) {
      throw new Error('No optimal meeting point found within the specified constraints');
    }

    return bestResult;
  }

  // Check if a station is a major transit hub
  private isTransitHub(station: Station): boolean {
    const majorHubs = [
      'Times Square-42nd Street',
      'Union Square-14th Street',
      'Grand Central-42nd Street',
      'Herald Square-34th Street',
      'Atlantic Avenue-Barclays Center',
      '42nd Street-Bryant Park',
      '59th Street-Columbus Circle',
      'Fulton Street',
      'Jay Street-MetroTech',
      'Court Square-23rd Street'
    ];
    
    return majorHubs.some(hub => station.name.includes(hub.split('-')[0])) || station.lines.length >= 4;
  }

  // Generate human-readable reasoning for the choice
  private generateReasoning(
    meetingStation: Station,
    route1: { time: number; transfers: number },
    route2: { time: number; transfers: number },
    timeDifference: number
  ): string {
    const reasons = [];

    if (timeDifference <= 5) {
      reasons.push('balanced travel times for both people');
    }

    if (route1.transfers === 0 && route2.transfers === 0) {
      reasons.push('direct routes with no transfers required');
    } else if (route1.transfers + route2.transfers <= 1) {
      reasons.push('minimal transfers required');
    }

    if (this.isTransitHub(meetingStation)) {
      reasons.push('major transit hub with excellent connectivity');
    }

    if (meetingStation.borough === 'Manhattan') {
      reasons.push('central Manhattan location');
    }

    const avgTime = (route1.time + route2.time) / 2;
    if (avgTime <= 20) {
      reasons.push('short travel times');
    }

    if (reasons.length === 0) {
      reasons.push('optimal balance of travel time and convenience');
    }

    return `Selected for ${reasons.join(', ')}.`;
  }
}

export const meetupOptimizer = new MeetupOptimizer();