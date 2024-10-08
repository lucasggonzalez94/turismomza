import { User } from '@/interfaces/user';
import { create } from 'zustand';

interface State {
  user: User | null;
  setUser: (user: User | null) => void;
}

export const useStore = create<State>((set) => ({
  user: null,
  setUser: (user) => set(() => ({ user: user })),
}));
