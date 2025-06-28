import { useState, useEffect, useCallback } from 'react';
import { Station, Train } from '../types';
import { getMTAService } from '../services/mtaService';
import { ServiceAlert } from '../services/mta/types';

export const useMTAStations = () => {
  const [stations, setStations] = useState<Station[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadStations = async () => {
      try {
        setLoading(true);
        setError(null);
        const mtaService = getMTAService();
        const stationsData = await mtaService.getStations();
        setStations(stationsData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load stations');
      } finally {
        setLoading(false);
      }
    };

    loadStations();
  }, []);

  return { stations, loading, error };
};

export const useMTATrains = (stationId: string | null) => {
  const [trains, setTrains] = useState<Train[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTrains = useCallback(async () => {
    if (!stationId) {
      setTrains([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const mtaService = getMTAService();
      const trainsData = await mtaService.getTrainsAtStation(stationId);
      setTrains(trainsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load trains');
    } finally {
      setLoading(false);
    }
  }, [stationId]);

  useEffect(() => {
    fetchTrains();
    
    // Set up polling for real-time updates
    const interval = setInterval(fetchTrains, 30000); // Update every 30 seconds
    
    return () => clearInterval(interval);
  }, [fetchTrains]);

  return { trains, loading, error, refetch: fetchTrains };
};

export const useServiceAlerts = (lines?: string[]) => {
  const [alerts, setAlerts] = useState<ServiceAlert[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAlerts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const mtaService = getMTAService();
      const alertsData = await mtaService.getServiceAlerts();
      
      // Filter by lines if specified
      const filteredAlerts = lines 
        ? alertsData.filter(alert => alert.affectedLines.some(line => lines.includes(line)))
        : alertsData;
      
      setAlerts(filteredAlerts);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load service alerts');
    } finally {
      setLoading(false);
    }
  }, [lines]);

  useEffect(() => {
    fetchAlerts();
    
    // Set up polling for alerts updates
    const interval = setInterval(fetchAlerts, 60000); // Update every minute
    
    return () => clearInterval(interval);
  }, [fetchAlerts]);

  return { alerts, loading, error, refetch: fetchAlerts };
};