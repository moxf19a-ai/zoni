import type { RequestHandler } from 'express';
import type { z } from 'zod';
import { ValidationError } from '../../../../application/errors/common-errors.js';

/**
 * Declarative Zod validation middleware factory — usable directly at the
 * router level (`router.post('/x', validateBody(schema), controller.x)`)
 * for any future module. This complements, and does not replace, the
 * `validate()` helper used inside the Auth module's controllers
 * (presentation/http/validate.ts) — both throw the same `ValidationError`
 * and produce an identical error response, they're just two call sites
 * for the same validation contract.
 */
export function validateBody<TSchema extends z.ZodTypeAny>(schema: TSchema): RequestHandler {
  return (req, _res, next) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      next(new ValidationError('Request validation failed.', result.error.flatten()));
      return;
    }

    req.body = result.data;
    next();
  };
}
