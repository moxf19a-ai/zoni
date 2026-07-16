/**
 * Environment-specific overrides for `production`.
 * See `development.ts` for the rationale behind keeping this minimal.
 */
export const productionConfig = {
  logLevel: 'info' as const,
  shutdownTimeoutMs: 10_000,
};
