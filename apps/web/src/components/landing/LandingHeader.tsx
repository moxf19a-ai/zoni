import type { JSX } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/Button';
import { BrandMark } from '../BrandMark';

export function LandingHeader(): JSX.Element {
  return (
    <header className="sticky top-0 z-20 border-b border-zinc-200 bg-white/80 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/80">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <BrandMark />
        <nav className="hidden items-center gap-6 text-sm font-medium text-zinc-600 dark:text-zinc-300 md:flex">
          <a href="#features" className="hover:text-zinc-900 dark:hover:text-white">المميزات</a>
          <a href="#steps" className="hover:text-zinc-900 dark:hover:text-white">إزاي تشتغل</a>
          <a href="#channels" className="hover:text-zinc-900 dark:hover:text-white">القنوات</a>
        </nav>
        <div className="flex items-center gap-2">
          <Link to="/login">
            <Button variant="ghost">تسجيل الدخول</Button>
          </Link>
          <Link to="/register">
            <Button variant="primary">جرّب Zoni مجانًا</Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
