import { createContext, useContext, useEffect, useMemo, ReactNode, useCallback } from 'react';
import { useQueryClient, useQuery, useInfiniteQuery, InfiniteData } from '@tanstack/react-query';
import { useSocket } from './SocketContext';
import { useUserContext } from './UserContext';
import Notification from '@appTypes/notification';
import { getNotifications, getUnreadNotificationCount } from '@shared/services/notification-service';
import {
  useMarkNotificationAsReadMutation,
  useMarkAllNotificationsAsReadMutation,
  useDeleteNotificationMutation,
  useDeleteAllReadNotificationsMutation
} from '@shared/hooks/mutations';

const PAGE_SIZE = 10;

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => void;
  markAsRead: (notificationId: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotificationById: (notificationId: string) => Promise<void>;
  deleteAllRead: () => Promise<void>;
  refetch: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const { user } = useUserContext();
  const socket = useSocket();
  const queryClient = useQueryClient();

  const {
    data,
    isLoading,
    hasNextPage = false,
    isFetchingNextPage,
    fetchNextPage
  } = useInfiniteQuery({
    queryKey: ['notifications', user?._id],
    queryFn: ({ pageParam }) =>
      getNotifications({ limit: PAGE_SIZE, cursor: pageParam as string | undefined }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => {
      if (lastPage.length < PAGE_SIZE) return undefined;
      const lastItem = lastPage[lastPage.length - 1];
      return lastItem?.createdAt;
    },
    enabled: !!user?._id,
    refetchOnWindowFocus: false,
    staleTime: 30000
  });

  const notifications = useMemo(() => data?.pages.flat() ?? [], [data]);

  // Fetch unread count
  const { data: unreadCountData } = useQuery({
    queryKey: ['notificationCount', user?._id],
    queryFn: getUnreadNotificationCount,
    enabled: !!user?._id,
    refetchInterval: 60000
  });

  const unreadCount = unreadCountData?.count || 0;

  // Notification mutations
  const markAsReadMutation = useMarkNotificationAsReadMutation();
  const markAllAsReadMutation = useMarkAllNotificationsAsReadMutation();
  const deleteNotificationMutation = useDeleteNotificationMutation();
  const deleteAllReadMutation = useDeleteAllReadNotificationsMutation();

  // Handle socket events
  useEffect(() => {
    if (!socket || !user?._id) return;
    const userId = user._id;

    const handleNewNotification = (incoming: { notification: Notification }) => {
      const updated = queryClient.setQueryData<InfiniteData<Notification[]>>(
        ['notifications', userId],
        (old) => {
          if (!old) return old;
          const firstPage = old.pages[0] ?? [];
          return {
            ...old,
            pages: [[incoming.notification, ...firstPage], ...old.pages.slice(1)]
          };
        }
      );

      if (!updated) {
        queryClient.invalidateQueries({ queryKey: ['notifications', userId] });
      }

      queryClient.setQueryData(['notificationCount', userId], (old: { count: number } = { count: 0 }) => {
        return { count: old.count + 1 };
      });
    };

    const handleCountUpdate = (incoming: { count: number }) => {
      queryClient.setQueryData(['notificationCount', userId], { count: incoming.count });
    };

    const handleReconnect = () => {
      queryClient.invalidateQueries({ queryKey: ['notifications', userId] });
      queryClient.invalidateQueries({ queryKey: ['notificationCount', userId] });
    };

    socket.on('notification:new', handleNewNotification);
    socket.on('notification:count', handleCountUpdate);
    socket.io.on('reconnect', handleReconnect);

    return () => {
      socket.off('notification:new', handleNewNotification);
      socket.off('notification:count', handleCountUpdate);
      socket.io.off('reconnect', handleReconnect);
    };
  }, [socket, user?._id, queryClient]);

  const markAsRead = useCallback(
    async (notificationId: string) => {
      await markAsReadMutation.mutateAsync(notificationId);
    },
    [markAsReadMutation]
  );

  const markAllAsRead = useCallback(async () => {
    await markAllAsReadMutation.mutateAsync();
  }, [markAllAsReadMutation]);

  const deleteNotificationById = useCallback(
    async (notificationId: string) => {
      await deleteNotificationMutation.mutateAsync(notificationId);
    },
    [deleteNotificationMutation]
  );

  const deleteAllRead = useCallback(async () => {
    await deleteAllReadMutation.mutateAsync();
  }, [deleteAllReadMutation]);

  const value: NotificationContextType = {
    notifications,
    unreadCount,
    isLoading,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    markAsRead,
    markAllAsRead,
    deleteNotificationById,
    deleteAllRead,
    refetch: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications', user?._id] });
      queryClient.invalidateQueries({ queryKey: ['notificationCount', user?._id] });
    }
  };

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
};

const defaultContextValue: NotificationContextType = {
  notifications: [],
  unreadCount: 0,
  isLoading: false,
  hasNextPage: false,
  isFetchingNextPage: false,
  fetchNextPage: () => {},
  markAsRead: async () => {},
  markAllAsRead: async () => {},
  deleteNotificationById: async () => {},
  deleteAllRead: async () => {},
  refetch: () => {}
};

export const useNotificationContext = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    return defaultContextValue;
  }
  return context;
};
