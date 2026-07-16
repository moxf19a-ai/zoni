import type { JSX } from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';

/**
 * Root application component (Milestone 7). The Milestone 2 placeholder
 * (a manual fetch('/health') health check) is retired now that the app
 * has real routes, real pages, and a real API-backed auth flow — its job
 * (confirming the dev environment boots) is superseded by actually using
 * the app end to end.
 */
export default function App(): JSX.Element {
  return <RouterProvider router={router} />;
}
