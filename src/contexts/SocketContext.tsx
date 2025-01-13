// SocketContext.tsx
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';
import { useQueryClient } from '@tanstack/react-query';
import { invalidateCartQueries, invalidateItemQueries } from '@utils/queryUtils';
import { removeExpiredItemsFromOfflineCart } from '@utils/cartUtils';
import { useOfflineCartContext } from './OfflineCartContext';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation('common');

  const { setOfflineCartContext } = useOfflineCartContext();

  useEffect(() => {
    const newSocket = io(BASE_URL, {
      withCredentials: true,
      transports: ['websocket', 'polling'],
      reconnection: true
    });

    newSocket.on('availabilityUpdated', (data) => {
      if (data.itemId) {
        invalidateItemQueries(queryClient, data.itemId);
      }
    });

    newSocket.on('reservationUpdated', (data) => {
      const updatedCart = removeExpiredItemsFromOfflineCart(data.reservationIds);
      if (updatedCart) {
        setOfflineCartContext(updatedCart);
      }
      invalidateCartQueries(queryClient, data.costumerId);
      toast.error(t('errors.cart_expired'));
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

  return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>;
};
