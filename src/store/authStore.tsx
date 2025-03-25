import { create } from 'zustand';
import { signOut } from 'next-auth/react';
import { logout as emailLogout } from '@/services/auth/logout';
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

    if (googleId) {
      const user = await getUserByGoogleIdService(googleId);
      set({
        user,
        authProvider: 'google',
      });
    }

    if (accessToken) {
      set({
        accessToken,
        isAuthenticated: true,
      });
    }
  },
  logout: async () => {
    const { authProvider } = get();
    if (authProvider === 'google') {
      await signOut();
    } else if (authProvider === 'credentials') {
      await emailLogout();
    }
    set({
      user: null,
      isAuthenticated: false,
      authProvider: null,
      accessToken: null,
    });
  },
  accessToken: null,
  setAccessToken: (accessToken) => set(() => ({ accessToken })),
}));
