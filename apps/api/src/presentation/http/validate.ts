import type { z } from 'zod';
import { ValidationError } from '../../application/errors/common-errors.js';

/**
 * Validates `data` against `schema`. On failure, throws `ValidationError`
 * with the Zod field errors as `details` — the centralized error handler
 * then formats it per docs/api-error-conventions.md automatically.
 *
 * Every controller in every future module should validate request input
 * through this helper instead of calling `schema.parse()` directly, so
 * validation failures always produce a consistent 400 response.
 */
export function validate<TSchema extends z.ZodTypeAny>(schema: TSchema, data: unknown): z.infer<TSchema> {
  const result = schema.safeParse(data);

  if (!result.success) {
    throw new ValidationError('Request validation failed.', result.error.flatten());
  }

  return result.data as z.infer<TSchema>;
}
