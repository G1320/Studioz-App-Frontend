import { createContext, useContext, useEffect, useRef, useState, ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';
import { useQueryClient } from '@tanstack/react-query';
import Cookies from 'js-cookie';
import { refreshAccessToken } from '@shared/services/auth-service';
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

  const userRef = useRef(user);
  userRef.current = user;

  const queryClientRef = useRef(queryClient);
  queryClientRef.current = queryClient;

  const offlineCartRef = useRef(setOfflineCartContext);
  offlineCartRef.current = setOfflineCartContext;

  useEffect(() => {
    if (!user?._id) {
      setSocket(null);
      return;
    }

    let isRefreshing = false;

    const newSocket = io(BASE_URL, {
      withCredentials: true,
      auth: { token: Cookies.get('accessToken') || '' },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 10000,
    });

    newSocket.on('connect', () => {
      const currentUser = userRef.current;
      if (currentUser?._id) {
        newSocket.emit('join:user', { userId: currentUser._id });
      }
    });

    newSocket.on('availabilityUpdated', (data) => {
      if (data.itemIds && Array.isArray(data.itemIds)) {
        invalidateItemQueries(queryClientRef.current, data.itemIds);
      } else if (data.itemId) {
        invalidateItemQueries(queryClientRef.current, data.itemId);
      }
    });

    newSocket.on('reservationUpdated', (data) => {
      const updatedCart = removeExpiredItemsFromOfflineCart(data.reservationIds);
      if (updatedCart) {
        offlineCartRef.current(updatedCart);
      }
      invalidateCartQueries(queryClientRef.current, data.customerId);
      invalidateReservationQueries(queryClientRef.current, data.reservationIds);
    });

    newSocket.on('connect_error', async (error) => {
      const isAuthError =
        error.message.includes('Authentication') ||
        error.message.includes('token') ||
        error.message.includes('expired');

      if (isAuthError && !isRefreshing) {
        isRefreshing = true;
        try {
          const { accessToken } = await refreshAccessToken();
          newSocket.auth = { token: accessToken };
        } catch {
          // Refresh failed — user session is gone, socket will stop reconnecting
          newSocket.disconnect();
        } finally {
          isRefreshing = false;
        }
      }
    });

    setSocket(newSocket);

    return () => {
      newSocket.removeAllListeners();
      newSocket.disconnect();
    };
  }, [user?._id]);

  return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>;
};
