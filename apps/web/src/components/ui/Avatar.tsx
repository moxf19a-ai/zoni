import type { JSX } from 'react';

export function Avatar({ label }: { label: string }): JSX.Element {
  const initial = label.trim().charAt(0).toUpperCase() || '?';
  return (
    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent-100 text-sm font-medium text-accent-700 dark:bg-accent-900/50 dark:text-accent-300">
      {initial}
    </div>
  );
}
