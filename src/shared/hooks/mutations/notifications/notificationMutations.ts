import { getLocalUser } from '@shared/services';
import { useMutationHandler } from '@shared/hooks';
import {
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification
} from '@shared/services/notification-service';
import Notification from 'src/types/notification';

export const useMarkNotificationAsReadMutation = () => {
  const userId = getLocalUser()?._id;

  return useMutationHandler<Notification, string>({
    mutationFn: (notificationId: string) => markNotificationAsRead(notificationId),
    invalidateQueries: [
      { queryKey: 'notifications', targetId: userId },
      { queryKey: 'notificationCount', targetId: userId }
    ]
  });
};

export const useMarkAllNotificationsAsReadMutation = () => {
  const userId = getLocalUser()?._id;

  return useMutationHandler<{ modifiedCount: number }, void>({
    mutationFn: () => markAllNotificationsAsRead(),
    successMessage: 'All notifications marked as read',
    invalidateQueries: [
      { queryKey: 'notifications', targetId: userId },
      { queryKey: 'notificationCount', targetId: userId }
    ]
  });
};

export const useDeleteNotificationMutation = () => {
  const userId = getLocalUser()?._id;

  return useMutationHandler<{ message: string }, string>({
    mutationFn: (notificationId: string) => deleteNotification(notificationId),
    successMessage: 'Notification deleted',
    invalidateQueries: [
      { queryKey: 'notifications', targetId: userId },
      { queryKey: 'notificationCount', targetId: userId }
    ]
  });
};

