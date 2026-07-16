/**
 * Environment-specific overrides for `development`.
 * Kept intentionally small — only values that genuinely differ per
 * environment belong here. Everything else lives in `env.ts` (validated
 * from process.env) or is a fixed application-wide constant.
 */
export const developmentConfig = {
  logLevel: 'debug' as const,
  shutdownTimeoutMs: 10_000,
};
