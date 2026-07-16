import type { RequestHandler } from 'express';
import { ForbiddenError } from '../../../../application/errors/common-errors.js';

const STATE_CHANGING_METHODS = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);

/**
 * CSRF mitigation for a stateless, JSON-only, Bearer-token API.
 *
 * Why not the classic `csurf` middleware: CSRF tokens exist to protect
 * apps that use COOKIES for authentication, where the browser attaches
 * credentials automatically to any cross-site request. This API never
 * authenticates via cookies (see docs/api-error-conventions.md and the
 * Auth module — tokens are returned in the response body and sent back
 * via the `Authorization` header, which a forged cross-site form/request
 * cannot set). `csurf` is also unmaintained and deprecated upstream.
 *
 * The real defense here: this middleware rejects any state-changing
 * request (POST/PUT/PATCH/DELETE) that isn't declared as
 * `Content-Type: application/json`. A malicious HTML form — the classic
 * CSRF delivery vector — can only submit
 * `application/x-www-form-urlencoded`, `multipart/form-data`, or
 * `text/plain`; it cannot set an arbitrary `Content-Type` header. Combined
 * with the strict CORS policy (cors.middleware.ts) and cookie-free auth,
 * this closes the CSRF attack surface for this architecture.
 */
export const csrfProtectionMiddleware: RequestHandler = (req, _res, next) => {
  if (!STATE_CHANGING_METHODS.has(req.method)) {
    next();
    return;
  }

  const contentType = req.header('content-type') ?? '';
  if (!contentType.toLowerCase().includes('application/json')) {
    next(
      new ForbiddenError(
        'This request must be sent with "Content-Type: application/json".',
      ),
    );
    return;
  }

  next();
};
