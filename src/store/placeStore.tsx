import { IPlaceFormContact, IPlaceFormDetails } from '@/interfaces/place-form';
import { create } from 'zustand';

interface State {
  placeFormDetails: IPlaceFormDetails | null;
  setPlaceFormDetails: (data: IPlaceFormDetails | null) => void;
  placeFormContact: IPlaceFormContact | null;
  setPlaceFormContact: (data: IPlaceFormContact | null) => void;
}

export const usePlaceStore = create<State>((set) => ({
  placeFormDetails: null,
  setPlaceFormDetails: (data) => set(() => ({ placeFormDetails: data })),
  placeFormContact: null,
  setPlaceFormContact: (data) => set(() => ({ placeFormContact: data })),
}));
