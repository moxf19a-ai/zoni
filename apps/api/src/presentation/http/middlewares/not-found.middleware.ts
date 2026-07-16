import type { RequestHandler } from 'express';
import { NotFoundError } from '../../../application/errors/common-errors.js';

/**
 * Catches any request that didn't match a route above it and forwards a
 * `NotFoundError` to the centralized error handler, so unmatched routes
 * return the same error envelope as every other error in the API.
 */
export const notFoundMiddleware: RequestHandler = (req, _res, next) => {
  next(new NotFoundError(`Route not found: ${req.method} ${req.originalUrl}`));
};
