import cors from 'cors';
import type { RequestHandler } from 'express';
import { appConfig } from '../../../../config/app.config.js';

/**
 * Restricts which browser origins may call this API. Requests with no
 * `Origin` header (server-to-server calls, curl, mobile apps) are always
 * allowed through — CORS is a browser-enforced mechanism and doesn't apply
 * to non-browser clients.
 */
export const corsMiddleware: RequestHandler = cors({
  origin(origin, callback) {
    if (!origin || appConfig.security.corsAllowedOrigins.includes(origin)) {
      callback(null, true);
      return;
    }
    callback(new Error(`Origin "${origin}" is not allowed by CORS policy.`));
  },
  credentials: true,
});
