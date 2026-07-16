import type { ContactsRepository, ContactRecord } from './interfaces/contacts-repository.interface.js';
import type {
  ConversationsRepository,
  ConversationRecord,
} from './interfaces/conversations-repository.interface.js';
import type { MessagesRepository, MessageRecord } from './interfaces/messages-repository.interface.js';
import { ConversationNotFoundError } from './messaging.errors.js';

export class MessagingQueryService {
  constructor(
    private readonly contactsRepository: ContactsRepository,
    private readonly conversationsRepository: ConversationsRepository,
    private readonly messagesRepository: MessagesRepository,
  ) {}

  listContacts(userId: string): Promise<ContactRecord[]> {
    return this.contactsRepository.listByUser(userId);
  }

  listConversations(userId: string): Promise<ConversationRecord[]> {
    return this.conversationsRepository.listByUser(userId);
  }

  /** Verifies the conversation belongs to `userId` before returning its messages — never trust the ID alone. */
  async listMessages(userId: string, conversationId: string): Promise<MessageRecord[]> {
    const conversation = await this.conversationsRepository.findById(conversationId);

    if (!conversation || conversation.userId !== userId) {
      throw new ConversationNotFoundError(`Conversation "${conversationId}" was not found.`);
    }

    return this.messagesRepository.listByConversation(conversationId);
  }
}
