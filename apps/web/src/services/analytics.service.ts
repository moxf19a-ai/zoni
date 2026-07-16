import { apiClient } from './api-client';
import type { ApiSuccessResponse } from '../types/api.types';

export interface AnalyticsSummary {
  totalContacts: number;
  totalConversations: number;
}

export async function getAnalyticsSummary(): Promise<AnalyticsSummary> {
  const res = await apiClient.get<ApiSuccessResponse<AnalyticsSummary>>('/analytics/summary');
  return res.data.data;
}
