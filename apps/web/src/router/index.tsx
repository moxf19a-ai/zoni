import { createBrowserRouter } from 'react-router-dom';
import { AppLayout } from '../components/AppLayout';
import { AuthLayout } from '../components/AuthLayout';
import { ProtectedRoute } from './ProtectedRoute';
import { GuestOnlyRoute } from './GuestOnlyRoute';
import { HomeRoute } from './HomeRoute';
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';
import { DashboardPage } from '../pages/DashboardPage';
import { ComingSoonPage } from '../pages/ComingSoonPage';
import { ChannelsPage } from '../pages/ChannelsPage';
import { NotFoundPage } from '../pages/NotFoundPage';

export const router: ReturnType<typeof createBrowserRouter> = createBrowserRouter([
  { path: '/', element: <HomeRoute /> },
  {
    element: <GuestOnlyRoute />,
    children: [
      {
        element: <AuthLayout />,
        children: [
          { path: '/login', element: <LoginPage /> },
          { path: '/register', element: <RegisterPage /> },
        ],
      },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { path: '/dashboard', element: <DashboardPage /> },
          { path: '/inbox', element: <ComingSoonPage title="المحادثات" /> },
          { path: '/channels', element: <ChannelsPage /> },
        ],
      },
    ],
  },
  { path: '*', element: <NotFoundPage /> },
]);
