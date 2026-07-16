import pino from 'pino';
import { appConfig } from '../../config/app.config.js';
import type { Logger } from '../../application/interfaces/logger.interface.js';

/**
 * Concrete Logger implementation (Pino). This is the ONLY file in the
 * project allowed to know that logging is implemented with Pino — every
 * consumer depends on the `Logger` interface instead.
 */
function createPinoLogger(): Logger {
  const instance = pino({
    level: appConfig.logLevel,
    ...(appConfig.nodeEnv === 'development'
      ? {
          transport: {
            target: 'pino-pretty',
            options: { colorize: true, translateTime: 'HH:MM:ss', ignore: 'pid,hostname' },
          },
        }
      : {}),
  });

  return {
    debug: (message, meta) => instance.debug(meta ?? {}, message),
    info: (message, meta) => instance.info(meta ?? {}, message),
    warn: (message, meta) => instance.warn(meta ?? {}, message),
    error: (message, meta) => instance.error(meta ?? {}, message),
  };
}

export const logger: Logger = createPinoLogger();
