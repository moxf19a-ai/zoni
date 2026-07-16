import { randomUUID } from 'node:crypto';
import type { RequestHandler } from 'express';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace -- this is the standard/documented way to augment Express's Request type
  namespace Express {
    interface Request {
      requestId: string;
    }
  }
}

/**
 * Attaches a unique `requestId` to every request — generated fresh, or
 * reused from an incoming `X-Request-Id` header (useful when the request
 * already passed through an upstream gateway/load balancer). Echoed back
 * in the response header so clients can correlate their own logs with
 * ours, and included in every error response (docs/api-error-conventions.md).
 */
export const requestIdMiddleware: RequestHandler = (req, res, next) => {
  const incomingId = req.header('x-request-id');
  const requestId = incomingId && incomingId.length > 0 ? incomingId : randomUUID();

  req.requestId = requestId;
  res.setHeader('x-request-id', requestId);
  next();
};
