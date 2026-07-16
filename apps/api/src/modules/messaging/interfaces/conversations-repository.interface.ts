export interface ConversationRecord {
  id: string;
  userId: string;
  contactId: string;
  provider: string;
  status: string;
  lastMessageAt: Date | null;
  createdAt: Date;
}

export interface FindOrCreateConversationInput {
  userId: string;
  contactId: string;
  provider: string;
}

export interface ConversationsRepository {
  findOrCreateByContact(input: FindOrCreateConversationInput): Promise<ConversationRecord>;
  findById(id: string): Promise<ConversationRecord | null>;
  listByUser(userId: string): Promise<ConversationRecord[]>;
  touchLastMessageAt(id: string, timestamp: Date): Promise<void>;
}
