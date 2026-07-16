import type { JSX } from 'react';
import { MessageCircle } from 'lucide-react';
import { BRAND_NAME } from '../config/brand';

export function BrandMark({ light = false }: { light?: boolean }): JSX.Element {
  return (
    <div className="flex items-center gap-2">
      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-accent-600">
        <MessageCircle className="h-4 w-4 text-white" fill="white" />
      </div>
      <span className={`text-base font-bold ${light ? 'text-white' : 'text-zinc-900 dark:text-zinc-100'}`}>
        {BRAND_NAME}
      </span>
    </div>
  );
}
