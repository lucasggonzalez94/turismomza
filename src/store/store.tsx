import { IPlaceFormContact, IPlaceFormDetails } from '@/interfaces/place-form';
import { Filters } from '@/interfaces/filters';
import { User } from '@/interfaces/user';
import { Socket } from 'socket.io-client';
import { create } from 'zustand';
import { ErrorFeedback } from '@/interfaces/errorFeedback';
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
  placeFormDetails: IPlaceFormDetails | null;
  setPlaceFormDetails: (data: IPlaceFormDetails | null) => void;
  placeFormContact: IPlaceFormContact | null;
  setPlaceFormContact: (data: IPlaceFormContact | null) => void;
  errorFeedback: ErrorFeedback | null;
  setErrorFeedback: (error: ErrorFeedback) => void;
  backPath: string;
  setBackPath: (path: string) => void;
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
  placeFormDetails: null,
  setPlaceFormDetails: (data) => set(() => ({ placeFormDetails: data })),
  placeFormContact: null,
  setPlaceFormContact: (data) => set(() => ({ placeFormContact: data })),
  errorFeedback: null,
  setErrorFeedback: (errorFeedback) => set(() => ({ errorFeedback })),
  backPath: '/',
  setBackPath: (path) => set(() => ({ backPath: path })),
}));
