import { User } from '@/interfaces/user';
import { create } from 'zustand';

interface State {
  user: User | null;
  setUser: (user: User) => void;
}

export const useStore = create<State>((set) => ({
  user: null,
  setUser: (user) => set(() => ({ user: user })),
}));
