import { useState, useEffect, useCallback } from 'react';
import { MeetupSession, Participant } from '../types';
import { meetupService } from '../services/meetupService';

export const useMeetupSession = (sessionId: string | null) => {
  const [session, setSession] = useState<MeetupSession | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSession = useCallback(async () => {
    if (!sessionId) {
      setSession(null);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const sessionData = await meetupService.getSession(sessionId);
      setSession(sessionData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load session');
    } finally {
      setLoading(false);
    }
  }, [sessionId]);

  const updateLocation = useCallback(async (location: {
    type: 'platform' | 'train' | 'car';
    stationId?: string;
    trainId?: string;
    carNumber?: number;
    carPosition?: 'front' | 'middle' | 'rear';
  }) => {
    if (!sessionId) return;

    try {
      await meetupService.updateLocation(sessionId, location);
      // Session will be updated via real-time subscription
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update location');
    }
  }, [sessionId]);

  const leaveSession = useCallback(async () => {
    if (!sessionId) return;

    try {
      await meetupService.leaveSession(sessionId);
      setSession(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to leave session');
    }
  }, [sessionId]);

  // Set up real-time subscription
  useEffect(() => {
    if (!sessionId) return;

    fetchSession();

    const unsubscribe = meetupService.subscribeToSession(sessionId, (updatedSession) => {
      setSession(updatedSession);
    });

    return unsubscribe;
  }, [sessionId, fetchSession]);

  return {
    session,
    loading,
    error,
    updateLocation,
    leaveSession,
    refetch: fetchSession
  };
};