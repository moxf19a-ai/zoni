export interface SubscriptionRecord {
  id: string;
  userId: string;
  plan: string;
  status: string;
  periodEnd: Date | null;
}

export interface BillingRepository {
  getByUser(userId: string): Promise<SubscriptionRecord | null>;
  upsert(userId: string, plan: string): Promise<SubscriptionRecord>;
}
