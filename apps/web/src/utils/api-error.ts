import { AxiosError } from 'axios';
import type { ApiErrorResponse } from '../types/api.types';

/**
 * Extracts a human-readable message from any error thrown by `apiClient`,
 * falling back to a generic message for network failures or anything
 * that isn't our API's error envelope (docs/api-error-conventions.md).
 */
export function getApiErrorMessage(error: unknown): string {
  if (error instanceof AxiosError) {
    const data = error.response?.data as ApiErrorResponse | undefined;
    if (data?.error?.message) {
      return data.error.message;
    }
    if (error.code === 'ERR_NETWORK') {
      return 'Could not reach the server. Please check your connection and try again.';
    }
  }
  return 'Something went wrong. Please try again.';
}
