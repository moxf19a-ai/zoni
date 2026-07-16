import helmet from 'helmet';
import type { RequestHandler } from 'express';

/**
 * Standard HTTP security headers (Helmet). Configured for a pure JSON API:
 * `contentSecurityPolicy` is disabled because this server never renders
 * HTML — CSP is a browser-page concern and has no effect on JSON
 * responses. Every other Helmet default (HSTS, X-Content-Type-Options,
 * X-Frame-Options, etc.) stays on.
 */
export const securityHeadersMiddleware: RequestHandler = helmet({
  contentSecurityPolicy: false,
});
