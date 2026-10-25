import { useQueryClient, InfiniteData } from '@tanstack/react-query';
import { getLocalUser } from '@shared/services';
import { useMutationHandler } from '@shared/hooks';
import {
  markNotificationAsRead,
  markAllNotificationsAsRead,
  archiveNotification,
  archiveAllReadNotifications,
  restoreNotification,
  deleteNotification
} from '@shared/services/notification-service';
import Notification from '@appTypes/notification';
import { useTranslation } from 'react-i18next';

const notificationInvalidateQueries = (userId?: string) => [
  { queryKey: 'notifications', targetId: userId },
  { queryKey: 'notifications-page', targetId: userId },
  { queryKey: 'notificationCount', targetId: userId }
];

const removeFromInfiniteCache = (
  old: InfiniteData<Notification[]> | undefined,
  notificationId: string
): { data: InfiniteData<Notification[]> | undefined; wasUnread: boolean } => {
  if (!old) return { data: old, wasUnread: false };
  let wasUnread = false;
  const pages = old.pages.map((page) => {
    const target = page.find((n) => n._id === notificationId);
    if (target && !target.read) wasUnread = true;
    return page.filter((n) => n._id !== notificationId);
  });
  return { data: { ...old, pages }, wasUnread };
};

export const useMarkNotificationAsReadMutation = () => {
  const userId = getLocalUser()?._id;

  return useMutationHandler<Notification, string>({
    mutationFn: (notificationId: string) => markNotificationAsRead(notificationId),
    invalidateQueries: notificationInvalidateQueries(userId)
  });
};

export const useMarkAllNotificationsAsReadMutation = () => {
  const userId = getLocalUser()?._id;
  const { t } = useTranslation('common');

  return useMutationHandler<{ modifiedCount: number }, void>({
    mutationFn: () => markAllNotificationsAsRead(),
    successMessage: t('toasts.success.allNotificationsRead'),
    invalidateQueries: notificationInvalidateQueries(userId)
  });
};

export const useArchiveNotificationMutation = () => {
  const userId = getLocalUser()?._id;
  const queryClient = useQueryClient();
  const { t } = useTranslation('common');

  return useMutationHandler<Notification, string>({
    mutationFn: (notificationId: string) => archiveNotification(notificationId),
    successMessage: t('toasts.success.notificationArchived', 'Notification archived'),
    invalidateQueries: notificationInvalidateQueries(userId),
    onSuccess: (_data, notificationId) => {
      const { data, wasUnread } = removeFromInfiniteCache(
        queryClient.getQueryData<InfiniteData<Notification[]>>(['notifications', userId]),
        notificationId
      );
      if (data) {
        queryClient.setQueryData(['notifications', userId], data);
      }
      if (wasUnread) {
        queryClient.setQueryData(['notificationCount', userId], (oldCount: { count: number } = { count: 0 }) => ({
          count: Math.max(0, oldCount.count - 1)
        }));
      }
    }
  });
};

export const useArchiveAllReadNotificationsMutation = () => {
  const userId = getLocalUser()?._id;
  const { t } = useTranslation('common');

  return useMutationHandler<{ archivedCount: number }, void>({
    mutationFn: () => archiveAllReadNotifications(),
    successMessage: t('toasts.success.readNotificationsArchived', 'Read notifications archived'),
    invalidateQueries: notificationInvalidateQueries(userId)
  });
};

export const useRestoreNotificationMutation = () => {
  const userId = getLocalUser()?._id;
  const { t } = useTranslation('common');

  return useMutationHandler<Notification, string>({
    mutationFn: (notificationId: string) => restoreNotification(notificationId),
    successMessage: t('toasts.success.notificationRestored', 'Notification restored'),
    invalidateQueries: notificationInvalidateQueries(userId)
  });
};

export const useDeleteNotificationMutation = () => {
  const userId = getLocalUser()?._id;
  const queryClient = useQueryClient();
  const { t } = useTranslation('common');

  return useMutationHandler<{ message: string }, string>({
    mutationFn: (notificationId: string) => deleteNotification(notificationId),
    successMessage: t('toasts.success.notificationDeleted'),
    invalidateQueries: notificationInvalidateQueries(userId),
    onSuccess: (_data, notificationId) => {
      queryClient.setQueryData<InfiniteData<Notification[]>>(
        ['notifications', userId],
        (old) => removeFromInfiniteCache(old, notificationId).data
      );
    }
  });
};
