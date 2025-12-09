// SocketContext.tsx
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';
import { useQueryClient } from '@tanstack/react-query';
import { invalidateCartQueries, invalidateItemQueries, invalidateReservationQueries } from '@shared/utils/queryUtils';
import { removeExpiredItemsFromOfflineCart } from '@shared/utils/cartUtils';
import { useOfflineCartContext } from './OfflineCartContext';
import { useUserContext } from './UserContext';

const BASE_URL =
  import.meta.env.VITE_NODE_ENV === 'production' ? 'https://studioz-backend.onrender.com' : 'http://localhost:3003';

const SocketContext = createContext<Socket | null>(null);

export const useSocket = () => useContext(SocketContext);

interface SocketProviderProps {
  children: ReactNode;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const queryClient = useQueryClient();
  const { user } = useUserContext();

  const { setOfflineCartContext } = useOfflineCartContext();

  useEffect(() => {
    const newSocket = io(BASE_URL, {
      withCredentials: true,
      transports: ['websocket', 'polling'],
      reconnection: true
    });

    newSocket.on('connect', () => {
      // Join user-specific room for notifications when connected
      if (user?._id) {
        newSocket.emit('join:user', { userId: user._id });
      }
    });

    // Join user room if user is already available when socket connects
    if (user?._id && newSocket.connected) {
      newSocket.emit('join:user', { userId: user._id });
    }

    newSocket.on('availabilityUpdated', (data) => {
      if (data.itemId) {
        invalidateItemQueries(queryClient, data.itemId);
      }
    });

    newSocket.on('reservationUpdated', (data) => {
      // Keep existing offline cart cleanup & toast behavior
      const updatedCart = removeExpiredItemsFromOfflineCart(data.reservationIds);
      if (updatedCart) {
        setOfflineCartContext(updatedCart);
      }
      invalidateCartQueries(queryClient, data.customerId);
      invalidateReservationQueries(queryClient, data.reservationIds);
    });

    newSocket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });

    setSocket(newSocket);

    return () => {
      if (newSocket.connected) {
        newSocket.disconnect();
      }
    };
  }, [queryClient]);

  // Handle user room joining when user changes
  useEffect(() => {
    if (socket && user?._id && socket.connected) {
      socket.emit('join:user', { userId: user._id });
    }
  }, [socket, user?._id]);

  return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>;
};
