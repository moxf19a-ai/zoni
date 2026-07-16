import { apiClient } from './api-client';
import type { ApiSuccessResponse } from '../types/api.types';
import type { AuthTokens, LoginFormValues, RegisterFormValues } from '../types/auth.types';

export async function registerRequest(input: RegisterFormValues): Promise<AuthTokens> {
  const response = await apiClient.post<ApiSuccessResponse<AuthTokens>>('/auth/register', input);
  return response.data.data;
}

export async function loginRequest(input: LoginFormValues): Promise<AuthTokens> {
  const response = await apiClient.post<ApiSuccessResponse<AuthTokens>>('/auth/login', input);
  return response.data.data;
}

export async function logoutRequest(refreshToken: string): Promise<void> {
  await apiClient.post('/auth/logout', { refreshToken });
}
