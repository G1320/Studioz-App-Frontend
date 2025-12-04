import { httpService } from './http-service';
import Notification from 'src/types/notification';

const notificationEndpoint = '/notifications';

export const getNotifications = async (options?: {
  read?: boolean;
  limit?: number;
  offset?: number;
}): Promise<Notification[]> => {
  try {
    const params = new URLSearchParams();
    if (options?.read !== undefined) {
      params.append('read', options.read.toString());
    }
    if (options?.limit) {
      params.append('limit', options.limit.toString());
    }
    if (options?.offset) {
      params.append('offset', options.offset.toString());
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

