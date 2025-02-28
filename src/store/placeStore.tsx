import { IPlaceFormContact, IPlaceFormDetails } from '@/interfaces/place-form';
import { Filters } from '@/interfaces/filters';
import { create } from 'zustand';

interface Price {
  minPrice: number;
  maxPrice: number;
}

interface State {
  filters: Filters | null;
  setFilters: (filters: Filters | null) => void;
  prices: Price;
  setPrices: (prices: Price) => void;
  placeFormDetails: IPlaceFormDetails | null;
  setPlaceFormDetails: (data: IPlaceFormDetails | null) => void;
  placeFormContact: IPlaceFormContact | null;
  setPlaceFormContact: (data: IPlaceFormContact | null) => void;
}

export const usePlaceStore = create<State>((set) => ({
  filters: null,
  setFilters: (filters) => set(() => ({ filters })),
  prices: {
    minPrice: 0,
    maxPrice: 0,
  },
  setPrices: (prices) => set(() => ({ prices })),
  placeFormDetails: null,
  setPlaceFormDetails: (data) => set(() => ({ placeFormDetails: data })),
  placeFormContact: null,
  setPlaceFormContact: (data) => set(() => ({ placeFormContact: data })),
}));
