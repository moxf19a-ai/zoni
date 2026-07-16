import type { ErrorRequestHandler } from 'express';
import { AppError } from '../../../application/errors/app-error.js';
import { logger } from '../../../infrastructure/logging/pino-logger.js';
import type { ApiErrorPayload, ApiErrorResponse } from '../api-response.type.js';

/**
 * Centralized error handler. Must be the LAST `app.use(...)` call in
 * `server.ts` (Express identifies error middleware by its 4-argument
 * signature — order matters).
 *
 * - Known errors (`AppError` subclasses) keep their own `code`/`statusCode`.
 * - Anything else is treated as unexpected and mapped to a generic 500,
 *   without leaking internal error messages to the client — the real
 *   message and stack trace go to the logger, not the response body.
 *
 * Response shape matches docs/api-error-conventions.md exactly.
 */
export const errorHandlerMiddleware: ErrorRequestHandler = (err, req, res, _next) => {
  const isAppError = err instanceof AppError;

  const statusCode = isAppError ? err.statusCode : 500;
  const code = isAppError ? err.code : 'INTERNAL_SERVER_ERROR';
  const message = isAppError ? err.message : 'An unexpected error occurred.';
  const details = isAppError ? err.details : undefined;
  const requestId: string | undefined = req.requestId;

  logger.error(message, {
    code,
    statusCode,
    requestId,
    details,
    stack: err instanceof Error ? err.stack : undefined,
  });

  const errorPayload: ApiErrorPayload = {
    code,
    message,
    timestamp: new Date().toISOString(),
    ...(details !== undefined ? { details } : {}),
    ...(requestId !== undefined ? { requestId } : {}),
  };

  const responseBody: ApiErrorResponse = {
    success: false,
    error: errorPayload,
  };

  res.status(statusCode).json(responseBody);
};
