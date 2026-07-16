import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AuthTokens, AuthenticatedUser } from '../types/auth.types';
import { decodeAccessToken } from '../utils/jwt';

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: AuthenticatedUser | null;
  isAuthenticated: boolean;
  setSession: (tokens: AuthTokens) => void;
  clearSession: () => void;
}

/**
 * Single source of truth for auth state on the client. Persisted to
 * localStorage (key below) so a page refresh doesn't log the user out —
 * this is standard for a JSON API using Bearer tokens (no cookies
 * involved, so this isn't a CSRF concern; see
 * apps/api .../csrf-protection.middleware.ts for why the backend doesn't
 * use cookie-based auth at all).
 */
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      user: null,
      isAuthenticated: false,

      setSession: (tokens) => {
        const payload = decodeAccessToken(tokens.accessToken);
        set({
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
          user: payload ? { id: payload.sub, email: payload.email } : null,
          isAuthenticated: true,
        });
      },

      clearSession: () => {
        set({ accessToken: null, refreshToken: null, user: null, isAuthenticated: false });
      },
    }),
    { name: 'auth-storage' },
  ),
);
