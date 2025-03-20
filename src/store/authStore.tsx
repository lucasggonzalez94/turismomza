import { IUser } from '@/interfaces/user';
import { verifySession } from '@/services/auth/verifySession';
import { create } from 'zustand';
import { useLoadingStore } from './loadingStore';

interface State {
  user: IUser | null;
  setUser: (user: IUser | null) => void;
  isAuthenticated: boolean;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
  checkAuth: () => Promise<void>;
  accessToken: string | null;
  setAccessToken: (token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<State>((set) => ({
  user: null,
  setUser: (user) => set(() => ({ user })),
  isAuthenticated: false,
  setIsAuthenticated: (isAuthenticated) => set(() => ({ isAuthenticated })),
  checkAuth: async () => {
    const setLoading = useLoadingStore.getState().setLoading;
    setLoading(true);

    try {
      const res = await verifySession();
      if (res?.error) throw new Error('No autenticado');

      const user = await res;
      set({ user, isAuthenticated: true });
    } catch {
      set({ user: null, isAuthenticated: false });
    } finally {
      setLoading(false);
    }
  },
  accessToken: null,
  setAccessToken: (token) => set({ accessToken: token }),
  logout: () => set({ accessToken: null }),
}));
