import { IUser } from '@/interfaces/user';
import { verifySession } from '@/services/auth/verifySession';
import { create } from 'zustand';

interface State {
  user: IUser | null;
  setUser: (user: IUser | null) => void;
  isAuthenticated: boolean;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<State>((set) => ({
  user: null,
  setUser: (user) => set(() => ({ user })),
  isAuthenticated: false,
  setIsAuthenticated: (isAuthenticated) => set(() => ({ isAuthenticated })),
  checkAuth: async () => {
    try {
      const { isAuthenticated } = useAuthStore.getState();

      if (!isAuthenticated) {
        const res = await verifySession();
        if (res?.error) throw new Error('No autenticado');

        const user = await res;
        set({ user, isAuthenticated: true });
      }
    } catch {
      set({ user: null, isAuthenticated: false });
    }
  },
}));
