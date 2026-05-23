import { useState, useEffect, useCallback, useRef } from 'react';
import {
  getGoogleCalendarAuthUrl,
  disconnectGoogleCalendar,
  getGoogleCalendarStatus,
  syncGoogleCalendar,
  GoogleCalendarStatus
} from '@shared/services/google-calendar-service';

interface UseGoogleCalendarOptions {
  /** When omitted, status is not fetched (e.g. guest). Refetch when this becomes available. */
  userId?: string | null;
}

interface UseGoogleCalendarReturn {
  isConnected: boolean;
  isLoading: boolean;
  error: Error | null;
  connect: (lang?: string, returnTo?: 'profile' | 'dashboard') => Promise<void>;
  disconnect: () => Promise<void>;
  refreshStatus: () => Promise<void>;
  sync: () => Promise<void>;
}

/**
 * React hook for managing Google Calendar connection
 * @returns Calendar connection state and methods
 */
export const useGoogleCalendar = (options?: UseGoogleCalendarOptions): UseGoogleCalendarReturn => {
  const userId = options?.userId;
  const [status, setStatus] = useState<GoogleCalendarStatus>({ connected: false });
  const [isLoading, setIsLoading] = useState(Boolean(userId));
  const [error, setError] = useState<Error | null>(null);
  const inFlightRef = useRef(false);

  const fetchStatus = useCallback(
    async (force = false) => {
      if (!userId) {
        setStatus({ connected: false });
        setIsLoading(false);
        return;
      }

      if (inFlightRef.current && !force) {
        return;
      }

      try {
        inFlightRef.current = true;
        setIsLoading(true);
        setError(null);
        const statusData = await getGoogleCalendarStatus();
        setStatus(statusData);
      } catch (err: unknown) {
        const httpError = err as { response?: { status?: number } };
        const httpStatus = httpError?.response?.status;

        if (httpStatus === 401) {
          console.log('Google Calendar status: app auth not ready or expired');
        } else if (httpStatus === 403) {
          console.log('Google Calendar status: feature not available on current plan');
        } else {
          console.log('Could not fetch Google Calendar status:', err);
        }

        const calendarError =
          err instanceof Error ? err : new Error('Failed to fetch calendar status');
        setError(calendarError);
        setStatus({ connected: false });
      } finally {
        inFlightRef.current = false;
        setIsLoading(false);
      }
    },
    [userId]
  );

  useEffect(() => {
    fetchStatus(true);
  }, [fetchStatus]);

  const connect = useCallback(
    async (lang?: string, returnTo: 'profile' | 'dashboard' = 'dashboard') => {
      try {
        setError(null);
        const authUrl = await getGoogleCalendarAuthUrl(lang, returnTo);
        window.location.href = authUrl;
      } catch (err) {
        const connectError =
          err instanceof Error ? err : new Error('Failed to get authorization URL');
        setError(connectError);
        throw connectError;
      }
    },
    []
  );

  const sync = useCallback(async () => {
    try {
      setError(null);
      await syncGoogleCalendar();
      await fetchStatus(true);
    } catch (err) {
      const syncError = err instanceof Error ? err : new Error('Failed to sync calendar');
      setError(syncError);
      throw syncError;
    }
  }, [fetchStatus]);

  const disconnect = useCallback(async () => {
    try {
      setError(null);
      await disconnectGoogleCalendar();
      await fetchStatus(true);
    } catch (err) {
      const disconnectError =
        err instanceof Error ? err : new Error('Failed to disconnect calendar');
      setError(disconnectError);
      throw disconnectError;
    }
  }, [fetchStatus]);

  const refreshStatus = useCallback(async () => {
    await fetchStatus(true);
  }, [fetchStatus]);

  return {
    isConnected: status.connected,
    isLoading,
    error,
    connect,
    disconnect,
    refreshStatus,
    sync
  };
};
