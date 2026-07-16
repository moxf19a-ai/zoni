import type { JSX } from 'react';

export function ComingSoonPage({ title }: { title: string }): JSX.Element {
  return (
    <div className="flex h-64 flex-col items-center justify-center text-center">
      <h1 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">{title}</h1>
      <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">قريبًا.</p>
    </div>
  );
}
