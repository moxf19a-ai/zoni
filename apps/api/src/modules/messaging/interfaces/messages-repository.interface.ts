export interface MessageRecord {
  id: string;
  conversationId: string;
  direction: string;
  externalMessageId: string | null;
  content: string | null;
  createdAt: Date;
}

export interface CreateMessageData {
  conversationId: string;
  direction: string;
  externalMessageId?: string | null;
  content?: string | null;
  rawPayload: unknown;
}

export interface MessagesRepository {
  create(data: CreateMessageData): Promise<MessageRecord>;
  /** Used to check for a duplicate BEFORE inserting — see MessageIngestionService. */
  findByExternalMessageId(externalMessageId: string): Promise<MessageRecord | null>;
  listByConversation(conversationId: string): Promise<MessageRecord[]>;
}
