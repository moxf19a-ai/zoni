export interface ChannelConnectionRecord {
  id: string;
  userId: string;
  provider: string;
  externalAccountId: string;
  /** Always the ENCRYPTED value as stored — decryption happens in the service layer, never in the repository. */
  accessToken: string;
  tokenExpiresAt: Date | null;
  status: string;
}

export interface UpsertChannelConnectionData {
  userId: string;
  provider: string;
  externalAccountId: string;
  accessToken: string;
  tokenExpiresAt: Date | null;
}

export interface ChannelConnectionsRepository {
  /** Creates the connection, or replaces an existing one for the same (userId, provider) pair — reconnecting always supersedes the previous connection. */
  upsert(data: UpsertChannelConnectionData): Promise<ChannelConnectionRecord>;
  findByUserAndProvider(userId: string, provider: string): Promise<ChannelConnectionRecord | null>;
  listByUserId(userId: string): Promise<ChannelConnectionRecord[]>;
  findByProviderAndExternalAccountId(
    provider: string,
    externalAccountId: string,
  ): Promise<ChannelConnectionRecord | null>;
}
