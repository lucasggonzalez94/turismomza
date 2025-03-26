import { create } from 'zustand';
import { signOut } from 'next-auth/react';
import { logout } from '@/services/auth/logout';
import { IUser } from '@/interfaces/user';
import { getUserByGoogleIdService } from '@/services/auth/get-user-by-google-id';
import { verifySession } from '@/services/auth/verifySession';

interface State {
  user: IUser | null;
  setUser: (user: IUser | null) => void;
  isAuthenticated: boolean;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
  checkAuth: () => Promise<boolean>;
  updateAuthState: (googleId?: string | null) => void;
  logout: () => Promise<void>;
  authProvider: 'credentials' | 'google' | null;
  setAuthProvider: (provider: 'credentials' | 'google' | null) => void;
}

export const useAuthStore = create<State>((set, get) => ({
  user: null,
  setUser: (user) => set(() => ({ user })),
  isAuthenticated: false,
  setIsAuthenticated: (isAuthenticated) => set(() => ({ isAuthenticated })),
  authProvider: null,
  setAuthProvider: (provider) => set(() => ({ authProvider: provider })),
  checkAuth: async () => {
    try {
      const { user, authProvider, ok } = await verifySession();
      set({ user, authProvider, isAuthenticated: ok });
      return ok;
    } catch {
      return false;
    }
  },
  updateAuthState: async (googleId) => {
    if (!googleId) {
      set({
        user: null,
        isAuthenticated: false,
        authProvider: null,
      });
      return;
    }

    if (googleId) {
      const user = await getUserByGoogleIdService(googleId);
      set({
        user,
        authProvider: 'google',
        isAuthenticated: true,
      });
    }
  },
  logout: async () => {
    const { authProvider } = get();
    // eslint-disable-next-line no-useless-catch
    try {
      if (authProvider === 'google') {
        await signOut();
        await logout();
      } else if (authProvider === 'credentials') {
        await logout();
      }
      set({
        user: null,
        isAuthenticated: false,
        authProvider: null,
      });
      window.location.href = '/auth/login';
    } catch (error) {
      throw error;
    }
  },
}));
