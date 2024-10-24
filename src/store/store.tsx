import { CreateFormFirstStep } from '@/interfaces/create-form';
import { Filters } from '@/interfaces/filters';
import { User } from '@/interfaces/user';
import { Socket } from 'socket.io-client';
import { create } from 'zustand';
interface Price {
  minPrice: number;
  maxPrice: number;
}
interface State {
  user: User | null;
  setUser: (user: User | null) => void;
  filters: Filters | null;
  setFilters: (filters: Filters | null) => void;
  prices: Price;
  setPrices: (prices: Price) => void;
  lastPath: string;
  setLastPath: (path: string) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  socket: Socket | null;
  setSocket: (socket: Socket) => void;
  createFirstStepData: CreateFormFirstStep | null;
  setCreateFirstStepData: (data: CreateFormFirstStep) => void;
}

export const useStore = create<State>((set) => ({
  user: null,
  setUser: (user) => set(() => ({ user: user })),
  filters: null,
  setFilters: (filters) => set(() => ({ filters })),
  prices: {
    minPrice: 0,
    maxPrice: 0,
  },
  setPrices: (prices) => set(() => ({ prices })),
  lastPath: '/',
  setLastPath: (path) => set(() => ({ lastPath: path })),
  loading: true,
  setLoading: (loading) => set(() => ({ loading })),
  socket: null,
  setSocket: (socket) => set(() => ({ socket })),
  createFirstStepData: null,
  setCreateFirstStepData: (data) => set(() => ({ createFirstStepData: data })),
}));
