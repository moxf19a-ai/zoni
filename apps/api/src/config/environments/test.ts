/**
 * Environment-specific overrides for `test`.
 * Log level is kept at `error` and shutdown is fast, so automated test
 * runs (Milestone 13) stay quiet and don't hang waiting for connections
 * to drain.
 */
export const testConfig = {
  logLevel: 'error' as const,
  shutdownTimeoutMs: 1_000,
};
