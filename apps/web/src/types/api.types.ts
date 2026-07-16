/**
 * Mirrors apps/api/src/presentation/http/api-response.type.ts and
 * docs/api-error-conventions.md exactly — kept in sync manually since
 * frontend and backend are separate packages without a shared-types
 * package yet (packages/types is created only once something beyond
 * these two apps actually needs to import it — see README.md).
 */
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

export interface ApiSuccessResponse<TData> {
  success: true;
  data: TData;
}
