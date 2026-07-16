import type { DatabaseClient } from '../../application/interfaces/database-client.type.js';
import type {
  CreateRefreshTokenData,
  RefreshTokensRepository,
  StoredRefreshToken,
} from './interfaces/refresh-tokens-repository.interface.js';

export class PrismaRefreshTokensRepository implements RefreshTokensRepository {
  constructor(private readonly db: DatabaseClient) {}

  async create(data: CreateRefreshTokenData): Promise<void> {
    await this.db.refreshToken.create({ data });
  }

  async findValidByHash(tokenHash: string): Promise<StoredRefreshToken | null> {
    const record = await this.db.refreshToken.findFirst({
      where: { tokenHash, revokedAt: null, expiresAt: { gt: new Date() } },
    });

    return record ? { id: record.id, userId: record.userId, expiresAt: record.expiresAt } : null;
  }

  async revoke(id: string): Promise<void> {
    await this.db.refreshToken.update({ where: { id }, data: { revokedAt: new Date() } });
  }
}
