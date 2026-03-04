import { httpService } from './http-service';
import Notification, { NotificationCategory } from '@appTypes/notification';

// ==========================================
// Notification Preferences Types
// ==========================================

export interface ChannelPreferences {
  inApp: boolean;
  email: boolean;
  push: boolean;
}

export interface NotificationPreferences {
  _id: string;
  userId: string;
  channels: {
    inApp: boolean;
    email: boolean;
    push: boolean;
  };
  perCategory: {
    bookings: ChannelPreferences;
    payments: ChannelPreferences;
    reviews: ChannelPreferences;
    billing: ChannelPreferences;
    system: ChannelPreferences;
    activity: ChannelPreferences;
  };
  quietHours: {
    enabled: boolean;
    start: string;
    end: string;
    timezone: string;
  };
}

const notificationEndpoint = '/notifications';

export const getNotifications = async (options?: {
  read?: boolean;
  category?: NotificationCategory;
  limit?: number;
  offset?: number;
  cursor?: string;
}): Promise<Notification[]> => {
  try {
    const params = new URLSearchParams();
    if (options?.read !== undefined) {
      params.append('read', options.read.toString());
    }
    if (options?.category) {
      params.append('category', options.category);
    }
    if (options?.limit) {
      params.append('limit', options.limit.toString());
    }
    if (options?.offset) {
      params.append('offset', options.offset.toString());
    }
    if (options?.cursor) {
      params.append('cursor', options.cursor);
    }

    const queryString = params.toString();
    const url = queryString ? `${notificationEndpoint}?${queryString}` : notificationEndpoint;

    return await httpService.get<Notification[]>(url);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    throw error;
  }
};

export const getUnreadNotificationCount = async (): Promise<{ count: number }> => {
  try {
    return await httpService.get<{ count: number }>(`${notificationEndpoint}/unread-count`);
  } catch (error) {
    console.error('Error fetching unread count:', error);
    throw error;
  }
};

export const markNotificationAsRead = async (notificationId: string): Promise<Notification> => {
  try {
    return await httpService.patch<Notification>(`${notificationEndpoint}/${notificationId}/read`);
  } catch (error) {
    console.error('Error marking notification as read:', error);
    throw error;
  }
};

export const markAllNotificationsAsRead = async (): Promise<{ modifiedCount: number }> => {
  try {
    return await httpService.patch<{ modifiedCount: number }>(`${notificationEndpoint}/read-all`);
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    throw error;
  }
};

export const deleteNotification = async (notificationId: string): Promise<{ message: string }> => {
  try {
    return await httpService.delete<{ message: string }>(`${notificationEndpoint}/${notificationId}`);
  } catch (error) {
    console.error('Error deleting notification:', error);
    throw error;
  }
};

export const deleteAllReadNotifications = async (): Promise<{ deletedCount: number }> => {
  try {
    return await httpService.delete<{ deletedCount: number }>(`${notificationEndpoint}/read`);
  } catch (error) {
    console.error('Error deleting all read notifications:', error);
    throw error;
  }
};

// ==========================================
// Notification Preferences
// ==========================================

export const getNotificationPreferences = async (): Promise<NotificationPreferences> => {
  try {
    return await httpService.get<NotificationPreferences>(`${notificationEndpoint}/preferences`);
  } catch (error) {
    console.error('Error fetching notification preferences:', error);
    throw error;
  }
};

export const updateNotificationPreferences = async (
  updates: Partial<Pick<NotificationPreferences, 'channels' | 'perCategory' | 'quietHours'>>
): Promise<NotificationPreferences> => {
  try {
    return await httpService.put<NotificationPreferences>(`${notificationEndpoint}/preferences`, updates);
  } catch (error) {
    console.error('Error updating notification preferences:', error);
    throw error;
  }
};

// ==========================================
// Web Push
// ==========================================

export const getPushPublicKey = async (): Promise<{ publicKey: string }> => {
  return httpService.get<{ publicKey: string }>(`${notificationEndpoint}/push/public-key`);
};

export const subscribePush = async (subscription: {
  endpoint: string;
  keys: { p256dh: string; auth: string };
}): Promise<{ message: string }> => {
  return httpService.post<{ message: string }>(`${notificationEndpoint}/push/subscribe`, subscription);
};

export const unsubscribePush = async (endpoint: string): Promise<{ message: string }> => {
  return httpService.post<{ message: string }>(`${notificationEndpoint}/push/unsubscribe`, { endpoint });
};
