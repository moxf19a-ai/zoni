import type { JSX } from 'react';
import { Outlet } from 'react-router-dom';
import { useThemeStore } from '../stores/theme.store';
import { Button } from './ui/Button';
import { BrandMark } from './BrandMark';

export function AuthLayout(): JSX.Element {
  const { theme, toggle } = useThemeStore();

  return (
    <div className="flex min-h-screen bg-white dark:bg-zinc-950">
      {/* Left branding panel — gradient, hidden on small screens */}
      <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-gradient-to-br from-accent-600 via-accent-800 to-zinc-950 p-10 text-white lg:flex">
        <div
          className="pointer-events-none absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              'radial-gradient(circle at 20% 20%, white 1px, transparent 1px), radial-gradient(circle at 80% 60%, white 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
        <div className="relative"><BrandMark light /></div>
        <div className="relative">
          <h2 className="text-3xl font-bold leading-snug">
            منصة واحدة تدير
            <br />
            كل تواصلك مع عملائك.
          </h2>
          <p className="mt-4 max-w-sm text-sm text-white/70">
            الذكاء الاصطناعي بيرد على عملائك على مدار الساعة، وانت بتكبّر بيزنسك.
          </p>
        </div>
        <div className="relative text-xs text-white/50">© 2026 Zoni</div>
      </div>

      {/* Right form panel */}
      <div className="relative flex w-full flex-1 items-center justify-center px-4 lg:w-1/2">
        <Button
          variant="ghost"
          onClick={toggle}
          aria-label="Toggle dark mode"
          className="absolute right-4 top-4"
        >
          {theme === 'dark' ? '☀️' : '🌙'}
        </Button>
        <div className="w-full max-w-sm">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
