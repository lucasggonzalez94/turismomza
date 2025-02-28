import { create } from 'zustand';

interface State {
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

export const useLoadingStore = create<State>((set) => ({
  loading: false,
  setLoading: (loading) => set(() => ({ loading })),
}));
