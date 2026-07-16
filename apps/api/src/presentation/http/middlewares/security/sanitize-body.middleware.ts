import type { RequestHandler } from 'express';

// Strips ASCII control characters (including null bytes) — these serve no
// legitimate purpose in user-submitted text and are a common vector for
// log injection / null-byte injection attacks.
// eslint-disable-next-line no-control-regex
const CONTROL_CHARS_PATTERN = /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g;

function sanitizeValue(value: unknown): unknown {
  if (typeof value === 'string') {
    return value.replace(CONTROL_CHARS_PATTERN, '').trim();
  }

  if (Array.isArray(value)) {
    return value.map(sanitizeValue);
  }

  if (value !== null && typeof value === 'object') {
    const sanitizedEntries = Object.entries(value as Record<string, unknown>).map(
      ([key, entryValue]) => [key, sanitizeValue(entryValue)] as const,
    );
    return Object.fromEntries(sanitizedEntries);
  }

  return value;
}

/**
 * Recursively trims whitespace and strips control characters from every
 * string in `req.body`, before it reaches any validation schema or
 * controller. Defense in depth: Prisma's parameterized queries already
 * prevent SQL injection, and React escapes text by default (preventing
 * stored XSS on render) — this middleware closes the remaining gap
 * (control-character/log injection) at the boundary, for every current
 * and future endpoint, with zero per-route wiring required.
 */
export const sanitizeBodyMiddleware: RequestHandler = (req, _res, next) => {
  if (req.body && typeof req.body === 'object') {
    req.body = sanitizeValue(req.body);
  }
  next();
};
