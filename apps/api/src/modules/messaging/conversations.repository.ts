import type { DatabaseClient } from '../../application/interfaces/database-client.type.js';
import type {
  ConversationRecord,
  ConversationsRepository,
  FindOrCreateConversationInput,
} from './interfaces/conversations-repository.interface.js';

export class PrismaConversationsRepository implements ConversationsRepository {
  constructor(private readonly db: DatabaseClient) {}

  async findOrCreateByContact(input: FindOrCreateConversationInput): Promise<ConversationRecord> {
    // `contactId` is @unique in the schema, so this is a true atomic
    // upsert — not a check-then-create — closing a race window where two
    // webhook deliveries for a brand-new contact arriving milliseconds
    // apart could otherwise both pass a `findFirst` before either
    // `create` commits.
    return this.db.conversation.upsert({
      where: { contactId: input.contactId },
      create: input,
      update: {},
    });
  }

  async findById(id: string): Promise<ConversationRecord | null> {
    return this.db.conversation.findFirst({ where: { id } });
  }

  async listByUser(userId: string): Promise<ConversationRecord[]> {
    return this.db.conversation.findMany({
      where: { userId },
      orderBy: { lastMessageAt: 'desc' },
    });
  }

  async touchLastMessageAt(id: string, timestamp: Date): Promise<void> {
    await this.db.conversation.update({ where: { id }, data: { lastMessageAt: timestamp } });
  }
}
