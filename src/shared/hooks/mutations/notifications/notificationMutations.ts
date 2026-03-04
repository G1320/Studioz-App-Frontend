import { useQueryClient, InfiniteData } from '@tanstack/react-query';
import { getLocalUser } from '@shared/services';
import { useMutationHandler } from '@shared/hooks';
import {
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  deleteAllReadNotifications
} from '@shared/services/notification-service';
import Notification from '@appTypes/notification';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation('common');

  return useMutationHandler<{ modifiedCount: number }, void>({
    mutationFn: () => markAllNotificationsAsRead(),
    successMessage: t('toasts.success.allNotificationsRead'),
    invalidateQueries: [
      { queryKey: 'notifications', targetId: userId },
      { queryKey: 'notificationCount', targetId: userId }
    ]
  });
};

export const useDeleteAllReadNotificationsMutation = () => {
  const userId = getLocalUser()?._id;
  const { t } = useTranslation('common');

  return useMutationHandler<{ deletedCount: number }, void>({
    mutationFn: () => deleteAllReadNotifications(),
    successMessage: t('toasts.success.allReadNotificationsDeleted', 'Read notifications deleted'),
    invalidateQueries: [
      { queryKey: 'notifications', targetId: userId },
      { queryKey: 'notificationCount', targetId: userId }
    ]
  });
};

export const useDeleteNotificationMutation = () => {
  const userId = getLocalUser()?._id;
  const queryClient = useQueryClient();
  const { t } = useTranslation('common');

  return useMutationHandler<{ message: string }, string>({
    mutationFn: (notificationId: string) => deleteNotification(notificationId),
    successMessage: t('toasts.success.notificationDeleted'),
    invalidateQueries: [
      { queryKey: 'notifications', targetId: userId },
      { queryKey: 'notificationCount', targetId: userId }
    ],
    onSuccess: (_data, notificationId) => {
      queryClient.setQueryData<InfiniteData<Notification[]>>(
        ['notifications', userId],
        (old) => {
          if (!old) return old;
          let wasUnread = false;
          const pages = old.pages.map((page) => {
            const target = page.find((n) => n._id === notificationId);
            if (target && !target.read) wasUnread = true;
            return page.filter((n) => n._id !== notificationId);
          });
          if (wasUnread) {
            queryClient.setQueryData(['notificationCount', userId], (oldCount: { count: number } = { count: 0 }) => ({
              count: Math.max(0, oldCount.count - 1)
            }));
          }
          return { ...old, pages };
        }
      );
    }
  });
};
