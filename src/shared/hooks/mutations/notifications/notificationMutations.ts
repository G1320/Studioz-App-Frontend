import { useQueryClient } from '@tanstack/react-query';
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
  const queryClient = useQueryClient();

  return useMutationHandler<{ message: string }, string>({
    mutationFn: (notificationId: string) => deleteNotification(notificationId),
    successMessage: 'Notification deleted',
    invalidateQueries: [
      { queryKey: 'notifications', targetId: userId },
      { queryKey: 'notificationCount', targetId: userId }
    ],
    onSuccess: (_data, notificationId) => {
      // Optimistically remove the notification from cache for immediate UI update
      queryClient.setQueryData(['notifications', userId], (old: Notification[] = []) => {
        const filtered = old.filter((n) => n._id !== notificationId);
        // Also optimistically update unread count if the deleted notification was unread
        const deletedNotification = old.find((n) => n._id === notificationId);
        if (deletedNotification && !deletedNotification.read) {
          queryClient.setQueryData(['notificationCount', userId], (oldCount: { count: number } = { count: 0 }) => {
            return { count: Math.max(0, oldCount.count - 1) };
          });
        }
        return filtered;
      });
    }
  });
};
