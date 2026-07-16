import type { DatabaseClient } from '../../application/interfaces/database-client.type.js';
import type { BillingRepository, SubscriptionRecord } from './interfaces/billing-repository.interface.js';

export class PrismaBillingRepository implements BillingRepository {
  constructor(private readonly db: DatabaseClient) {}

  async getByUser(userId: string): Promise<SubscriptionRecord | null> {
    return this.db.subscription.findFirst({ where: { userId } });
  }

  async upsert(userId: string, plan: string): Promise<SubscriptionRecord> {
    return this.db.subscription.upsert({
      where: { userId },
      create: { userId, plan, status: 'active' },
      update: { plan, status: 'active' },
    });
  }
}
