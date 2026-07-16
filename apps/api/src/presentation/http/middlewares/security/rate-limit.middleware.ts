import rateLimit from 'express-rate-limit';
import { appConfig } from '../../../../config/app.config.js';
import { TooManyRequestsError } from '../../../../application/errors/common-errors.js';

/**
 * Shared handler: routes every rate-limit rejection through the
 * centralized error handler instead of express-rate-limit's default
 * plain-text response, so it comes back in the standard error envelope
 * (docs/api-error-conventions.md).
 */
const rateLimitExceededHandler: import('express-rate-limit').Options['handler'] = (
  _req,
  _res,
  next,
) => {
  next(new TooManyRequestsError('Too many requests. Please try again later.'));
};

/**
 * General-purpose limiter applied to the whole API (except health checks,
 * which are excluded in server.ts by mounting order — they're registered
 * before this middleware).
 */
export const defaultRateLimiter = rateLimit({
  windowMs: appConfig.security.rateLimitWindowMs,
  limit: appConfig.security.rateLimitMaxRequests,
  standardHeaders: true,
  legacyHeaders: false,
  handler: rateLimitExceededHandler,
});

/**
 * Stricter limiter for `/api/v1/auth/*` specifically — login and
 * registration are the classic brute-force / credential-stuffing targets,
 * so they get a much lower ceiling than the rest of the API.
 */
export const authRateLimiter = rateLimit({
  windowMs: appConfig.security.rateLimitWindowMs,
  limit: appConfig.security.rateLimitAuthMaxRequests,
  standardHeaders: true,
  legacyHeaders: false,
  handler: rateLimitExceededHandler,
});
