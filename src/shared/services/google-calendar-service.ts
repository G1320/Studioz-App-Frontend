import { httpService } from '@shared/services';

const googleCalendarEndpoint = '/auth/google/calendar';

export interface GoogleCalendarStatus {
  connected: boolean;
  lastSyncAt?: Date;
}

export interface GoogleCalendarAuthUrl {
  authUrl: string;
}

/**
 * Get Google Calendar OAuth authorization URL
 * @returns Authorization URL
 */
export const getGoogleCalendarAuthUrl = async (): Promise<string> => {
  const response = await httpService.get<GoogleCalendarAuthUrl>(
    `${googleCalendarEndpoint}/connect`
  );
  return response.authUrl;
};

/**
 * Disconnect Google Calendar
 */
export const disconnectGoogleCalendar = async (): Promise<void> => {
  await httpService.post(`${googleCalendarEndpoint}/disconnect`);
};

/**
 * Get Google Calendar connection status
 * @returns Connection status
 */
export const getGoogleCalendarStatus = async (): Promise<GoogleCalendarStatus> => {
  return await httpService.get<GoogleCalendarStatus>(`${googleCalendarEndpoint}/status`);
};

/**
 * Sync Google Calendar events to block time slots
 * @returns Sync result
 */
export const syncGoogleCalendar = async (): Promise<{ message: string; syncToken?: string }> => {
  return await httpService.post<{ message: string; syncToken?: string }>(`${googleCalendarEndpoint}/sync`);
};

