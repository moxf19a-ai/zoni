import type { JSX } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/auth.store';
import { useThemeStore } from '../stores/theme.store';
import { logoutRequest } from '../services/auth.service';
import { Avatar } from './ui/Avatar';
import { Button } from './ui/Button';
import { BrandMark } from './BrandMark';

const navItems = [
  { to: '/dashboard', label: 'الرئيسية' },
  { to: '/inbox', label: 'المحادثات' },
  { to: '/channels', label: 'القنوات' },
];

export function AppLayout(): JSX.Element {
  const { user, refreshToken, clearSession } = useAuthStore();
  const { theme, toggle } = useThemeStore();
  const navigate = useNavigate();

  const handleLogout = async (): Promise<void> => {
    if (refreshToken) await logoutRequest(refreshToken).catch(() => undefined);
    clearSession();
    navigate('/login', { replace: true });
  };

  return (
    <div className="flex h-screen bg-zinc-50 dark:bg-zinc-950">
      <aside className="flex w-60 flex-col border-r border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        <div className="px-4 py-4">
          <BrandMark />
        </div>
        <nav className="flex-1 space-y-1 px-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `block rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-accent-50 text-accent-700 dark:bg-accent-900/30 dark:text-accent-300'
                    : 'text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        {user && (
          <div className="flex items-center gap-2 border-t border-zinc-200 p-3 dark:border-zinc-800">
            <Avatar label={user.email} />
            <span className="flex-1 truncate text-xs text-zinc-500 dark:text-zinc-400">{user.email}</span>
          </div>
        )}
      </aside>

      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex items-center justify-end gap-2 border-b border-zinc-200 bg-white px-4 py-2.5 dark:border-zinc-800 dark:bg-zinc-900">
          <Button variant="ghost" onClick={toggle} aria-label="Toggle dark mode">
            {theme === 'dark' ? '☀️' : '🌙'}
          </Button>
          {user && (
            <Button variant="secondary" onClick={handleLogout}>
              تسجيل الخروج
            </Button>
          )}
        </header>
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
