import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserRole } from '@prisma/client';

interface AuthUser {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  role: UserRole;
  isActive: boolean;
}

interface AuthState {
  user: AuthUser | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  setUser: (user: AuthUser | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  logout: () => void;

  // Computed
  isAuthenticated: () => boolean;
  hasRole: (role: UserRole) => boolean;
  hasAnyRole: (roles: UserRole[]) => boolean;
  isAdmin: () => boolean;
  isManager: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isLoading: false,
      error: null,

      setUser: (user) => set({ user }),
      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),
      clearError: () => set({ error: null }),
      logout: () => set({ user: null, error: null }),

      // Computed
      isAuthenticated: () => {
        const { user } = get();
        return !!user && user.isActive;
      },

      hasRole: (role) => {
        const { user } = get();
        return user?.role === role;
      },

      hasAnyRole: (roles) => {
        const { user } = get();
        return !!user && roles.includes(user.role);
      },

      isAdmin: () => {
        const { user } = get();
        return user?.role === 'ADMIN';
      },

      isManager: () => {
        const { user } = get();
        return user?.role === 'MANAGER';
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
      }),
    }
  )
);