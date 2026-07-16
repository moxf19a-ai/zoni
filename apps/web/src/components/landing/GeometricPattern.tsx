import type { JSX } from 'react';

/** Subtle 8-point star geometric pattern (Islamic/Arabic geometric motif), used as a decorative background layer. */
export function GeometricPattern({ className = '' }: { className?: string }): JSX.Element {
  return (
    <svg className={className} viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <defs>
        <pattern id="star8" width="50" height="50" patternUnits="userSpaceOnUse">
          <g fill="none" stroke="currentColor" strokeWidth="1">
            <path d="M25 4 L31 19 L46 19 L34 28 L39 43 L25 34 L11 43 L16 28 L4 19 L19 19 Z" />
          </g>
        </pattern>
      </defs>
      <rect width="200" height="200" fill="url(#star8)" />
    </svg>
  );
}
