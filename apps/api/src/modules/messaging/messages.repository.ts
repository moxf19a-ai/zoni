import type { DatabaseClient } from '../../application/interfaces/database-client.type.js';
import type {
  CreateMessageData,
  MessageRecord,
  MessagesRepository,
} from './interfaces/messages-repository.interface.js';

export class PrismaMessagesRepository implements MessagesRepository {
  constructor(private readonly db: DatabaseClient) {}

  async create(data: CreateMessageData): Promise<MessageRecord> {
    return this.db.message.create({
      data: {
        conversationId: data.conversationId,
        direction: data.direction,
        externalMessageId: data.externalMessageId ?? null,
        content: data.content ?? null,
        // Round-trips through JSON to guarantee the value is genuinely
        // JSON-serializable (Prisma's `Json` column type requires this;
        // a plain `unknown` cast would let non-serializable values like
        // functions or circular references through undetected).
        rawPayload: JSON.parse(JSON.stringify(data.rawPayload)),
      },
    });
  }

  async findByExternalMessageId(externalMessageId: string): Promise<MessageRecord | null> {
    return this.db.message.findFirst({ where: { externalMessageId } });
  }

  async listByConversation(conversationId: string): Promise<MessageRecord[]> {
    return this.db.message.findMany({
      where: { conversationId },
      orderBy: { createdAt: 'asc' },
    });
  }
}
