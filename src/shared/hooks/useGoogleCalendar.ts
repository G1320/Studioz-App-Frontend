import { useState, useEffect, useCallback } from 'react';
import {
  getGoogleCalendarAuthUrl,
  disconnectGoogleCalendar,
  getGoogleCalendarStatus,
  syncGoogleCalendar,
  GoogleCalendarStatus
} from '@shared/services/google-calendar-service';

interface UseGoogleCalendarReturn {
  isConnected: boolean;
  isLoading: boolean;
  error: Error | null;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  refreshStatus: () => Promise<void>;
  syncCalendar: () => Promise<void>;
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
  const fetchStatus = useCallback(async (autoSync: boolean = true) => {
    try {
      setIsLoading(true);
      setError(null);
      const statusData = await getGoogleCalendarStatus();
      setStatus(statusData);
      
      // Auto-sync if connected and it's been more than 5 minutes since last sync
      if (autoSync && statusData.connected) {
        const lastSync = statusData.lastSyncAt ? new Date(statusData.lastSyncAt) : null;
        const shouldSync = !lastSync || (Date.now() - lastSync.getTime()) > 5 * 60 * 1000; // 5 minutes
        
        if (shouldSync) {
          console.log('Auto-syncing Google Calendar...');
          try {
            await syncGoogleCalendar();
            // Refresh status after sync
            const updatedStatus = await getGoogleCalendarStatus();
            setStatus(updatedStatus);
          } catch (syncErr) {
            console.warn('Auto-sync failed (non-critical):', syncErr);
            // Don't set error for auto-sync failures
          }
        }
      }
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

  // Sync Google Calendar events
  const syncCalendar = useCallback(async () => {
    try {
      setError(null);
      await syncGoogleCalendar();
      await fetchStatus(false); // Refresh status after sync (disable auto-sync to avoid double sync)
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to sync calendar');
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
    refreshStatus: fetchStatus,
    syncCalendar
  };
};

