import { create } from 'zustand';

interface State {
  lastPath: string;
  setLastPath: (path: string) => void;
  backPath: string;
  setBackPath: (path: string) => void;
}

export const useNavigationStore = create<State>((set) => ({
  lastPath: '/',
  setLastPath: (path) => set(() => ({ lastPath: path })),
  backPath: '/',
  setBackPath: (path) => set(() => ({ backPath: path })),
}));
