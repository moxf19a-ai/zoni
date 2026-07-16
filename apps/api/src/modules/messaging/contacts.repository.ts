import type { DatabaseClient } from '../../application/interfaces/database-client.type.js';
import type {
  ContactRecord,
  ContactsRepository,
  UpsertContactData,
} from './interfaces/contacts-repository.interface.js';

export class PrismaContactsRepository implements ContactsRepository {
  constructor(private readonly db: DatabaseClient) {}

  async upsertByExternalId(data: UpsertContactData): Promise<ContactRecord> {
    return this.db.contact.upsert({
      where: {
        userId_provider_externalContactId: {
          userId: data.userId,
          provider: data.provider,
          externalContactId: data.externalContactId,
        },
      },
      create: data,
      // Only touch displayName on update — everything else (identity
      // fields) never changes for an existing contact.
      update: data.displayName !== undefined ? { displayName: data.displayName } : {},
    });
  }

  async findById(id: string): Promise<ContactRecord | null> {
    return this.db.contact.findFirst({ where: { id } });
  }

  async listByUser(userId: string): Promise<ContactRecord[]> {
    return this.db.contact.findMany({ where: { userId }, orderBy: { updatedAt: 'desc' } });
  }
}
