import type { JSX } from 'react';
import { BrandMark } from '../BrandMark';

const links = [
  { label: 'الخصوصية', href: '#' },
  { label: 'الشروط', href: '#' },
  { label: 'تواصل معنا', href: '#' },
  { label: 'GitHub', href: '#' },
];

export function LandingFooter(): JSX.Element {
  return (
    <footer className="border-t border-zinc-200 bg-white py-10 dark:border-white/10 dark:bg-zinc-950">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-6 sm:flex-row">
        <BrandMark />
        <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-zinc-500 dark:text-zinc-400">
          {links.map((l) => (
            <a key={l.label} href={l.href} className="transition-colors hover:text-zinc-900 dark:hover:text-white">
              {l.label}
            </a>
          ))}
        </nav>
        <span className="text-xs text-zinc-400 dark:text-zinc-600">© 2026 Zoni</span>
      </div>
    </footer>
  );
}
