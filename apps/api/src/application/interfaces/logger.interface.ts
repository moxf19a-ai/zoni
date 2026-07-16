/**
 * Logger abstraction (Application layer port).
 *
 * Every future service/repository/middleware depends on this interface,
 * never on a concrete logging library directly. The concrete
 * implementation (currently Pino) lives in
 * `infrastructure/logging/pino-logger.ts`.
 */
export interface Logger {
  debug(message: string, meta?: Record<string, unknown>): void;
  info(message: string, meta?: Record<string, unknown>): void;
  warn(message: string, meta?: Record<string, unknown>): void;
  error(message: string, meta?: Record<string, unknown>): void;
}
