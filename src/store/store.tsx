import { IAttractionForm } from '@/interfaces/attraction-form';
import { DayConfig } from '@/interfaces/schedule';
import { Filters } from '@/interfaces/filters';
import { User } from '@/interfaces/user';
import { Socket } from 'socket.io-client';
import { create } from 'zustand';
import { ErrorFeedback } from '@/interfaces/errorFeedback';
interface Price {
  minPrice: number;
  maxPrice: number;
}
interface Schedule {
  selectedDays: string[];
  config: Record<string, DayConfig>;
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
  attractionFormData: IAttractionForm | null;
  setAttractionFormData: (data: IAttractionForm) => void;
  schedule: Schedule | null;
  setSchedule: (schedule: Schedule) => void;
  errorFeedback: ErrorFeedback | null;
  setErrorFeedback: (error: ErrorFeedback) => void;
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
  attractionFormData: null,
  setAttractionFormData: (data) => set(() => ({ attractionFormData: data })),
  schedule: null,
  setSchedule: (schedule) => set(() => ({ schedule })),
  errorFeedback: null,
  setErrorFeedback: (errorFeedback) => set(() => ({ errorFeedback })),
}));
