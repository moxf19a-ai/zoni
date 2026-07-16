import type { DatabaseClient } from '../../application/interfaces/database-client.type.js';
import type {
  ChannelConnectionRecord,
  ChannelConnectionsRepository,
  UpsertChannelConnectionData,
} from './interfaces/channel-connections-repository.interface.js';

export class PrismaChannelConnectionsRepository implements ChannelConnectionsRepository {
  constructor(private readonly db: DatabaseClient) {}

  async upsert(data: UpsertChannelConnectionData): Promise<ChannelConnectionRecord> {
    return this.db.channelConnection.upsert({
      where: { userId_provider: { userId: data.userId, provider: data.provider } },
      create: { ...data, status: 'active' },
      update: {
        externalAccountId: data.externalAccountId,
        accessToken: data.accessToken,
        tokenExpiresAt: data.tokenExpiresAt,
        status: 'active',
      },
    });
  }

  async findByUserAndProvider(
    userId: string,
    provider: string,
  ): Promise<ChannelConnectionRecord | null> {
    return this.db.channelConnection.findFirst({ where: { userId, provider } });
  }

  async listByUserId(userId: string): Promise<ChannelConnectionRecord[]> {
    return this.db.channelConnection.findMany({ where: { userId } });
  }

  async findByProviderAndExternalAccountId(
    provider: string,
    externalAccountId: string,
  ): Promise<ChannelConnectionRecord | null> {
    return this.db.channelConnection.findFirst({ where: { provider, externalAccountId } });
  }
}
