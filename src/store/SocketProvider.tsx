'use client';

import React, { useEffect, ReactNode, FC } from 'react';
import { io } from 'socket.io-client';
import { useAuthStore } from './authStore';
import { useSocketStore } from './socketStore';

interface SocketProviderProps {
  children: ReactNode;
}

const SocketProvider: FC<SocketProviderProps> = ({ children }) => {
  const user = useAuthStore((state) => state.user);
  const setSocket = useSocketStore((state) => state.setSocket);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return <>{children}</>;
};

export default SocketProvider;
