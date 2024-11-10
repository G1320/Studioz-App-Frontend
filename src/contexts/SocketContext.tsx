// SocketContext.tsx
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';
import { useQueryClient } from '@tanstack/react-query';
import { invalidateItemQueries } from '@utils/queryUtils';

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

  useEffect(() => {
    console.log('Initializing socket connection');
    const newSocket = io(BASE_URL, {
      withCredentials: true,
      transports: ['websocket', 'polling'],
      reconnection: true
    });

    newSocket.on('connect', () => {
      console.log('Socket connected with ID:', newSocket.id);
    });

    newSocket.on('availabilityUpdated', (data) => {
      if (data.itemId) {
        invalidateItemQueries(queryClient, data.itemId);
      }
    });

    newSocket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });

    setSocket(newSocket);

    return () => {
      console.log('Cleaning up socket connection');
      newSocket.close();
    };
  }, [queryClient]);

  return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>;
};
