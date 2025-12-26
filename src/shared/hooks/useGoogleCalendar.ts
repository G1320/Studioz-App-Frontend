import { useState, useEffect, useCallback } from 'react';
import {
  getGoogleCalendarAuthUrl,
  disconnectGoogleCalendar,
  getGoogleCalendarStatus,
  GoogleCalendarStatus
} from '@shared/services/google-calendar-service';

interface UseGoogleCalendarReturn {
  isConnected: boolean;
  isLoading: boolean;
  error: Error | null;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  refreshStatus: () => Promise<void>;
}

/**
 * React hook for managing Google Calendar connection
 * @returns Calendar connection state and methods
 */
export const useGoogleCalendar = (): UseGoogleCalendarReturn => {
  const [status, setStatus] = useState<GoogleCalendarStatus>({ connected: false });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Fetch connection status
  const fetchStatus = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const statusData = await getGoogleCalendarStatus();
      setStatus(statusData);
    } catch (err) {
      // Silently fail - user might not be authenticated or API might not be available
      console.log('Could not fetch Google Calendar status:', err);
      const error = err instanceof Error ? err : new Error('Failed to fetch calendar status');
      setError(error);
      setStatus({ connected: false });
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial status fetch
  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  // Connect to Google Calendar
  const connect = useCallback(async () => {
    try {
      setError(null);
      const authUrl = await getGoogleCalendarAuthUrl();
      // Redirect to Google OAuth
      window.location.href = authUrl;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to get authorization URL');
      setError(error);
      throw error;
    }
  }, []);

  // Disconnect Google Calendar
  const disconnect = useCallback(async () => {
    try {
      setError(null);
      await disconnectGoogleCalendar();
      await fetchStatus(); // Refresh status after disconnect
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to disconnect calendar');
      setError(error);
      throw error;
    }
  }, [fetchStatus]);

  return {
    isConnected: status.connected,
    isLoading,
    error,
    connect,
    disconnect,
    refreshStatus: fetchStatus
  };
};

