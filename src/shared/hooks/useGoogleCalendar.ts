import { useState, useEffect, useCallback, useRef } from 'react';
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
  const hasFetched = useRef(false);

  // Fetch connection status
  const fetchStatus = useCallback(async (force = false) => {
    // Skip if already fetched successfully (prevents repeated 401 requests)
    if (hasFetched.current && !force) {
      return;
    }
    
    try {
      setIsLoading(true);
      setError(null);
      const statusData = await getGoogleCalendarStatus();
      setStatus(statusData);
      hasFetched.current = true;
    } catch (err: unknown) {
      // Handle 401/403 errors gracefully - treat as not connected
      const httpError = err as { response?: { status?: number } };
      const status = httpError?.response?.status;
      
      if (status === 401 || status === 403) {
        // Auth error - user needs to re-authenticate, treat as not connected
        console.log('Google Calendar auth expired or revoked');
        hasFetched.current = true; // Don't retry on auth errors
      } else {
        console.log('Could not fetch Google Calendar status:', err);
      }
      
      const error = err instanceof Error ? err : new Error('Failed to fetch calendar status');
      setError(error);
      setStatus({ connected: false });
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial status fetch (only once)
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
      hasFetched.current = false; // Reset so we can fetch fresh status
      await fetchStatus(true); // Force refresh status after disconnect
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to disconnect calendar');
      setError(error);
      throw error;
    }
  }, [fetchStatus]);

  // Manual refresh (force fetch)
  const refreshStatus = useCallback(async () => {
    hasFetched.current = false;
    await fetchStatus(true);
  }, [fetchStatus]);

  return {
    isConnected: status.connected,
    isLoading,
    error,
    connect,
    disconnect,
    refreshStatus
  };
};

