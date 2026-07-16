import type { RequestHandler } from 'express';
import type { TokenService } from '../../../modules/auth/interfaces/token-service.interface.js';
import { UnauthorizedError } from '../../../application/errors/common-errors.js';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace -- standard way to augment Express's Request type (see request-id.middleware.ts)
  namespace Express {
    interface Request {
      user?: { id: string; email: string };
    }
  }
}

/**
 * Generic Bearer-token authentication middleware — protects any route
 * that requires a logged-in user, regardless of which module owns that
 * route. Depends only on the `TokenService` abstraction from the Auth
 * module (Milestone 5), not on any Auth internals — reusing a published
 * interface across modules is expected; this does not modify or reopen
 * the Auth module itself.
 */
export function createAuthenticateMiddleware(tokenService: TokenService): RequestHandler {
  return (req, _res, next) => {
    const authHeader = req.header('authorization');
    const token = authHeader?.startsWith('Bearer ') ? authHeader.slice('Bearer '.length) : null;

    if (!token) {
      next(new UnauthorizedError('Authentication required.'));
      return;
    }

    try {
      const payload = tokenService.verifyAccessToken(token);
      req.user = { id: payload.sub, email: payload.email };
      next();
    } catch {
      next(new UnauthorizedError('Invalid or expired access token.'));
    }
  };
}
