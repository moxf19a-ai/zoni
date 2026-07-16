import { apiClient } from './api-client';
import type { ApiSuccessResponse } from '../types/api.types';
import type { ChannelConnection } from '../types/channel.types';

export async function listChannelConnections(): Promise<ChannelConnection[]> {
  const res = await apiClient.get<ApiSuccessResponse<ChannelConnection[]>>('/channels');
  return res.data.data;
}

export async function getConnectUrl(provider: string): Promise<string> {
  const res = await apiClient.get<ApiSuccessResponse<{ authorizationUrl: string }>>(
    `/channels/${provider}/connect`,
  );
  return res.data.data.authorizationUrl;
}
