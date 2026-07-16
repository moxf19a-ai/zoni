import type { JSX } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../stores/auth.store';

/**
 * Inverse of ProtectedRoute: keeps an already-authenticated user away
 * from /login and /register (no reason to show them a login form).
 */
export function GuestOnlyRoute(): JSX.Element {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
