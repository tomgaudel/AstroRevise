import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, AuthState } from '../types/index.js';

export const useAuthStore = create<AuthState & {
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  logout: () => void;
}>(
  persist(
    (set) => ({
      user: null,
      token: null,
      isLoading: false,
      error: null,

      setUser: (user) => set({ user }),
      setToken: (token) => set({ token }),
      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),

      logout: () => set({ user: null, token: null, error: null }),
    }),
    {
      name: 'auth-store',
    }
  )
);
