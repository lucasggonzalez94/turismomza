import { create } from 'zustand';
import { Socket } from 'socket.io-client';

interface State {
  socket: Socket | null;
  setSocket: (socket: Socket) => void;
}

export const useSocketStore = create<State>((set) => ({
  socket: null,
  setSocket: (socket) => set(() => ({ socket })),
}));
