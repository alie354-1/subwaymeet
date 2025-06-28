import { Station, Train } from '../types';
import { MTA_STATIONS } from './mta/stations';
import { trainsService } from './mta/trains';
import { alertsService } from './mta/alerts';
import { ServiceAlert } from './mta/types';

export { MTA_STATIONS };

export class MTAService {
  async getStations(): Promise<Station[]> {
    return MTA_STATIONS;
  }

  async getTrainsAtStation(stationId: string): Promise<Train[]> {
    return trainsService.getTrainsAtStation(stationId);
  }

  async getServiceAlerts(): Promise<ServiceAlert[]> {
    return alertsService.getServiceAlerts();
  }

  getAlertsForLines(lines: string[]): ServiceAlert[] {
    return alertsService.getAlertsForLines(lines);
  }
}

// Export singleton instance
const mtaService = new MTAService();

export const getMTAService = (): MTAService => {
  return mtaService;
};