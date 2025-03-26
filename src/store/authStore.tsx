import { create } from 'zustand';
import { signOut } from 'next-auth/react';
import { logout } from '@/services/auth/logout';
import { IUser } from '@/interfaces/user';
import { getUserByGoogleIdService } from '@/services/auth/get-user-by-google-id';

interface State {
  user: IUser | null;
  setUser: (user: IUser | null) => void;
  isAuthenticated: boolean;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
  updateAuthState: (
    googleId?: string | null,
    accessToken?: string | null,
  ) => void;
  logout: () => Promise<void>;
  authProvider: 'credentials' | 'google' | null;
  setAuthProvider: (provider: 'credentials' | 'google' | null) => void;
  accessToken: string | null;
  setAccessToken: (accessToken: string | null) => void;
}

export const useAuthStore = create<State>((set, get) => ({
  user: null,
  setUser: (user) => set(() => ({ user })),
  isAuthenticated: false,
  setIsAuthenticated: (isAuthenticated) => set(() => ({ isAuthenticated })),
  authProvider: null,
  setAuthProvider: (provider) => set(() => ({ authProvider: provider })),
  updateAuthState: async (googleId, accessToken) => {
    if (!googleId && !accessToken) {
      set({
        user: null,
        isAuthenticated: false,
        authProvider: null,
        accessToken: null,
      });
      return;
    }

    if (accessToken) {
      set({
        accessToken,
        isAuthenticated: true,
      });
    }

    if (googleId) {
      const user = await getUserByGoogleIdService(googleId);
      set({
        user,
        authProvider: 'google',
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
        accessToken: null,
      });
      window.location.href = '/auth/login';
    } catch (error) {
      throw error;
    }
  },
  accessToken: null,
  setAccessToken: (accessToken) => set(() => ({ accessToken })),
}));
