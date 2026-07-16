import type { JSX } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '../stores/auth.store';

/**
 * Guards its child routes (via `<Outlet />`) behind authentication.
 * Redirects to `/login`, preserving the original destination in
 * `location.state.from` so login can send the user back where they meant
 * to go.
 */
export function ProtectedRoute(): JSX.Element {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}
