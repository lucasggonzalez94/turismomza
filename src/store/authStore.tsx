import { IUser } from '@/interfaces/user';
import { create } from 'zustand';
import { signOut } from 'next-auth/react';
import { login as emailLogin } from '@/services/auth/login';
import { logout as emailLogout } from '@/services/auth/logout';

interface LoginCredentials {
  email: string;
  password: string;
}

interface State {
  user: IUser | null;
  setUser: (user: IUser | null) => void;
  isAuthenticated: boolean;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
  updateAuthState: (session: any) => void;
  login: (credentials: LoginCredentials) => Promise<void>;
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
  login: async (credentials) => {
    try {
      const data = await emailLogin(credentials);
      set({
        user: data,
        isAuthenticated: true,
        authProvider: 'credentials',
      });
    } catch (error) {
      set({
        user: null,
        isAuthenticated: false,
        authProvider: null,
      });
      throw error;
    }
  },
  updateAuthState: (session) => {
    if (!session) {
      set({
        user: null,
        isAuthenticated: false,
        authProvider: null,
      });
      return;
    }

    const userData: IUser = {
      id: session.user.id,
      name: session.user.name || '',
      email: session.user.email || '',
      image: session.user.image || null,
      role: 'USER',
      two_factor_enabled: false,
      profilePicture: null,
      createdAt: new Date().toISOString(),
    };

    set({
      user: userData,
      isAuthenticated: true,
      authProvider: 'google',
    });
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
    });
  },
}));
