import { createContext, useContext, useEffect, ReactNode, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useSocket } from './SocketContext';
import { useUserContext } from './UserContext';
import Notification from 'src/types/notification';
import { getNotifications, getUnreadNotificationCount } from '@shared/services/notification-service';
import {
  useMarkNotificationAsReadMutation,
  useMarkAllNotificationsAsReadMutation,
  useDeleteNotificationMutation
} from '@shared/hooks/mutations';
import { useQuery } from '@tanstack/react-query';

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  markAsRead: (notificationId: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotificationById: (notificationId: string) => Promise<void>;
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

  // Fetch notifications
  const { data: notifications = [], isLoading } = useQuery({
    queryKey: ['notifications', user?._id],
    queryFn: () => getNotifications({ limit: 20 }),
    enabled: !!user?._id,
    refetchOnWindowFocus: false,
    staleTime: 30000 // 30 seconds
  });

  // Fetch unread count
  const { data: unreadCountData } = useQuery({
    queryKey: ['notificationCount', user?._id],
    queryFn: getUnreadNotificationCount,
    enabled: !!user?._id,
    refetchInterval: 60000 // Refetch every minute
  });

  const unreadCount = unreadCountData?.count || 0;

  // Notification mutations
  const markAsReadMutation = useMarkNotificationAsReadMutation();
  const markAllAsReadMutation = useMarkAllNotificationsAsReadMutation();
  const deleteNotificationMutation = useDeleteNotificationMutation();

  // Handle socket events
  useEffect(() => {
    if (!socket || !user?._id) return;

    const handleNewNotification = (data: { notification: Notification }) => {
      // Add new notification to the list
      queryClient.setQueryData(['notifications', user._id], (old: Notification[] = []) => {
        return [data.notification, ...old].slice(0, 20);
      });

      // Update unread count
      queryClient.setQueryData(['notificationCount', user._id], (old: { count: number } = { count: 0 }) => {
        return { count: old.count + 1 };
      });
    };

    const handleCountUpdate = (data: { count: number }) => {
      queryClient.setQueryData(['notificationCount', user._id], { count: data.count });
    };

    socket.on('notification:new', handleNewNotification);
    socket.on('notification:count', handleCountUpdate);

    return () => {
      socket.off('notification:new', handleNewNotification);
      socket.off('notification:count', handleCountUpdate);
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

  const value: NotificationContextType = {
    notifications,
    unreadCount,
    isLoading,
    markAsRead,
    markAllAsRead,
    deleteNotificationById,
    refetch: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications', user?._id] });
      queryClient.invalidateQueries({ queryKey: ['notificationCount', user?._id] });
    }
  };

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
};

// Default context value for when provider isn't ready (HMR, initial load race conditions)
const defaultContextValue: NotificationContextType = {
  notifications: [],
  unreadCount: 0,
  isLoading: false,
  markAsRead: async () => {},
  markAllAsRead: async () => {},
  deleteNotificationById: async () => {},
  refetch: () => {}
};

export const useNotificationContext = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  // Return default value instead of throwing to handle HMR and race conditions gracefully
  if (context === undefined) {
    return defaultContextValue;
  }
  return context;
};
