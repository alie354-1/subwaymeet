import { ServiceAlert, GTFSRealtimeMessage } from './types';
import { MTA_API_BASE, ALERTS_FEED } from './feeds';
import { protobufParser } from './protobuf';

export class AlertsService {
  private cache: Map<string, { data: ServiceAlert[]; timestamp: number }> = new Map();
  private readonly CACHE_DURATION = 60000; // 1 minute for alerts
  private initialized = false;

  private async ensureInitialized(): Promise<void> {
    if (!this.initialized) {
      await protobufParser.initialize();
      this.initialized = true;
    }
  }

  async getServiceAlerts(): Promise<ServiceAlert[]> {
    const cacheKey = 'service-alerts';
    const cached = this.cache.get(cacheKey);
    const now = Date.now();
    
    if (cached && (now - cached.timestamp) < this.CACHE_DURATION) {
      return cached.data;
    }

    try {
      await this.ensureInitialized();
      
      console.log('Fetching service alerts from MTA API...');
      
      // Use the correct alerts endpoint
      const response = await fetch(`${MTA_API_BASE}/${ALERTS_FEED}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/x-protobuf',
          'User-Agent': 'MTA-Meetup-App/1.0',
          'Cache-Control': 'no-cache'
        }
      });

      if (!response.ok) {
        console.warn(`MTA Alerts API returned ${response.status}, falling back to mock data`);
        throw new Error(`MTA Alerts API error: ${response.status} ${response.statusText}`);
      }

      const arrayBuffer = await response.arrayBuffer();
      console.log(`Received ${arrayBuffer.byteLength} bytes of alerts data`);
      
      const alerts = await this.parseAlertsFromProtobuf(arrayBuffer);
      console.log(`Parsed ${alerts.length} service alerts`);
      
      this.cache.set(cacheKey, { data: alerts, timestamp: now });
      return alerts;
    } catch (error) {
      console.error('Error fetching service alerts:', error);
      
      // Return cached data if available, even if expired
      if (cached) {
        console.log('Using cached alerts data');
        return cached.data;
      }
      
      // Fallback to mock alerts if no cache available
      console.log('Using mock alerts data');
      return this.getMockAlerts();
    }
  }

  private async parseAlertsFromProtobuf(arrayBuffer: ArrayBuffer): Promise<ServiceAlert[]> {
    try {
      const alertEntities = protobufParser.parseAlerts(arrayBuffer);
      const alerts: ServiceAlert[] = [];

      console.log(`Processing ${alertEntities.length} alert entities`);

      for (const entity of alertEntities) {
        const alert = entity.alert;
        if (!alert) continue;

        // Extract affected lines from informed entities
        const affectedLines = new Set<string>();
        for (const informedEntity of alert.informedEntity || []) {
          if (informedEntity.routeId) {
            affectedLines.add(informedEntity.routeId);
          }
        }

        // Skip alerts that don't affect any specific lines
        if (affectedLines.size === 0) continue;

        // Get alert text
        const headerText = this.getTranslatedText(alert.headerText);
        const descriptionText = this.getTranslatedText(alert.descriptionText);
        
        if (!headerText && !descriptionText) continue;

        // Determine severity based on effect
        let severity: ServiceAlert['severity'] = 'info';
        if (alert.effect) {
          switch (alert.effect) {
            case 'NO_SERVICE':
            case 'SIGNIFICANT_DELAYS':
              severity = 'severe';
              break;
            case 'REDUCED_SERVICE':
            case 'DETOUR':
            case 'MODIFIED_SERVICE':
              severity = 'warning';
              break;
            default:
              severity = 'info';
          }
        }

        // Parse time ranges
        let startTime: Date | undefined;
        let endTime: Date | undefined;
        
        if (alert.activePeriod && alert.activePeriod.length > 0) {
          const period = alert.activePeriod[0];
          if (period.start) {
            startTime = new Date(parseInt(period.start) * 1000);
          }
          if (period.end) {
            endTime = new Date(parseInt(period.end) * 1000);
          }
        }

        const serviceAlert: ServiceAlert = {
          id: entity.id,
          title: headerText || 'Service Alert',
          description: descriptionText || 'Check MTA website for details',
          affectedLines: Array.from(affectedLines),
          severity,
          startTime,
          endTime,
          url: this.getTranslatedText(alert.url)
        };

        alerts.push(serviceAlert);
        console.log(`Added alert: ${serviceAlert.title} affecting lines: ${serviceAlert.affectedLines.join(', ')}`);
      }

      return alerts;
    } catch (error) {
      console.error('Error parsing alerts from protobuf:', error);
      return this.getMockAlerts();
    }
  }

  private getTranslatedText(translatedString: any): string | undefined {
    if (!translatedString?.translation) return undefined;
    
    // Look for English translation first, then fall back to first available
    const englishTranslation = translatedString.translation.find(
      (t: any) => t.language === 'en' || !t.language
    );
    
    if (englishTranslation?.text) {
      return englishTranslation.text;
    }
    
    // Fall back to first available translation
    return translatedString.translation[0]?.text;
  }

  private getMockAlerts(): ServiceAlert[] {
    return [
      {
        id: 'weekend-work-nqrw',
        title: 'Weekend Service Changes',
        description: 'N, Q, R, and W trains running with delays due to signal modernization work between Manhattan and Queens. Allow extra travel time.',
        affectedLines: ['N', 'Q', 'R', 'W'],
        severity: 'warning',
        startTime: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        endTime: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours from now
      },
      {
        id: 'l-train-normal',
        title: 'L Train Service Update',
        description: 'L train service is running normally with minor delays during peak hours.',
        affectedLines: ['L'],
        severity: 'info',
        startTime: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
      },
      {
        id: 'bdfm-delays',
        title: 'B, D, F, M Train Delays',
        description: 'B, D, F, and M trains experiencing delays due to train traffic ahead. Expect delays of 10-15 minutes.',
        affectedLines: ['B', 'D', 'F', 'M'],
        severity: 'warning',
        startTime: new Date(Date.now() - 45 * 60 * 1000), // 45 minutes ago
      },
      {
        id: 'ace-service-change',
        title: 'A, C, E Service Advisory',
        description: 'A, C, and E trains running on modified schedule due to track maintenance. Some stations may be skipped.',
        affectedLines: ['A', 'C', 'E'],
        severity: 'severe',
        startTime: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
        endTime: new Date(Date.now() + 6 * 60 * 60 * 1000) // 6 hours from now
      },
      {
        id: '456-good-service',
        title: 'Good Service',
        description: '4, 5, and 6 trains are running on schedule with no delays.',
        affectedLines: ['4', '5', '6'],
        severity: 'info',
        startTime: new Date(Date.now() - 10 * 60 * 1000), // 10 minutes ago
      },
      {
        id: '123-weekend-service',
        title: '1, 2, 3 Train Weekend Service',
        description: '1, 2, and 3 trains running on weekend schedule with some service changes in Manhattan.',
        affectedLines: ['1', '2', '3'],
        severity: 'info',
        startTime: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
        endTime: new Date(Date.now() + 48 * 60 * 60 * 1000) // 48 hours from now
      },
      {
        id: '7-express-service',
        title: '7 Express Limited Service',
        description: '7 Express service is limited due to signal problems. Local 7 service is running normally.',
        affectedLines: ['7'],
        severity: 'warning',
        startTime: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      },
      {
        id: 'g-shuttle-service',
        title: 'G Train Shuttle Service',
        description: 'G train running shuttle service between Court Sq and Church Ave due to track work.',
        affectedLines: ['G'],
        severity: 'severe',
        startTime: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
        endTime: new Date(Date.now() + 12 * 60 * 60 * 1000) // 12 hours from now
      }
    ];
  }

  getAlertsForLines(lines: string[]): ServiceAlert[] {
    // This would be called with cached alerts
    const cached = this.cache.get('service-alerts');
    if (!cached) return [];
    
    return cached.data.filter(alert => 
      alert.affectedLines.some(line => lines.includes(line))
    );
  }
}

export const alertsService = new AlertsService();