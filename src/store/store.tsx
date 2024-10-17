import { Filters } from '@/interfaces/filters';
import { User } from '@/interfaces/user';
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
}));
