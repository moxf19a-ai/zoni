/**
 * Shared HTTP response contract for the API.
 *
 * Status: preparation only. `/health` and `/health/database` intentionally
 * keep their current raw response shape for this milestone — no existing
 * endpoint behavior changes here. Every NEW endpoint introduced from
 * Milestone 4 onward must use these types so the whole API responds with
 * one consistent envelope.
 *
 * The error envelope's shape (`code`, `message`, `details`, `requestId`,
 * `timestamp`) mirrors docs/api-error-conventions.md — the two must stay
 * in sync if either changes.
 */

export interface ApiSuccessResponse<TData> {
  success: true;
  data: TData;
}

export interface ApiErrorPayload {
  code: string;
  message: string;
  details?: unknown;
  requestId?: string;
  timestamp: string;
}

export interface ApiErrorResponse {
  success: false;
  error: ApiErrorPayload;
}

export type ApiResponse<TData> = ApiSuccessResponse<TData> | ApiErrorResponse;
