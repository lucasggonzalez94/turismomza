'use client';

import React, { useEffect, ReactNode, FC } from 'react';
import { useStore } from '@/store/store';
import { io } from 'socket.io-client';
import { useAuthStore } from './authStore';

interface SocketProviderProps {
  children: ReactNode;
}

const SocketProvider: FC<SocketProviderProps> = ({ children }) => {
  const user = useAuthStore((state) => state.user);
  const setSocket = useStore((state) => state.setSocket);

  useEffect(() => {
    if (user) {
      const newSocket = io(process.env.NEXT_PUBLIC_SOCKET_URL as string, {
        transports: ['websocket'],
        withCredentials: true,
        query: { userId: user?.id },
      });

      setSocket(newSocket);

      newSocket.on('connect', () => {
        console.log('Socket conectado:', newSocket.id);
      });

      return () => {
        newSocket.disconnect();
      };
    }
  }, [user]);

  return <>{children}</>;
};

export default SocketProvider;
