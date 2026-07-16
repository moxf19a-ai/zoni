/**
 * Base class for every application error.
 *
 * Deliberately framework-agnostic: no Express types here. Mapping an
 * `AppError` to an HTTP response is a Presentation-layer concern (see
 * `presentation/http/middlewares/error-handler.middleware.ts`).
 *
 * Matches the fields documented in docs/api-error-conventions.md:
 * `code` and `message` are always present; `details` is optional.
 */
export abstract class AppError extends Error {
  abstract readonly code: string;
  abstract readonly statusCode: number;
  readonly details?: unknown;

  constructor(message: string, details?: unknown) {
    super(message);
    this.name = new.target.name;
    if (details !== undefined) {
      this.details = details;
    }
    Error.captureStackTrace?.(this, new.target);
  }
}
