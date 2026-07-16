import type { AiProviderRegistry } from '../ai/ai-provider.registry.js';
import type { ConversationsRepository } from '../messaging/interfaces/conversations-repository.interface.js';
import type { MessagesRepository } from '../messaging/interfaces/messages-repository.interface.js';
import { AppError } from '../../application/errors/app-error.js';

export class UnknownAiProviderError extends AppError {
  readonly code = 'AI_UNKNOWN_PROVIDER';
  readonly statusCode = 404;
}

export class FlowsService {
  constructor(
    private readonly aiProviderRegistry: AiProviderRegistry,
    private readonly conversationsRepository: ConversationsRepository,
    private readonly messagesRepository: MessagesRepository,
  ) {}

  /** Skeleton flow: take conversation history, ask the AI provider for a reply, store it as an outbound message. */
  async generateAutoReply(conversationId: string, providerKey: string) {
    const provider = this.aiProviderRegistry.get(providerKey);
    if (!provider) {
      throw new UnknownAiProviderError(`Unknown AI provider: "${providerKey}".`);
    }

    const history = await this.messagesRepository.listByConversation(conversationId);
    const replyText = await provider.generateReply({
      conversationHistory: history
        .filter((m) => m.content)
        .map((m) => ({ role: m.direction === 'inbound' ? 'user' : 'assistant', content: m.content! }) as const),
      prompt: 'Reply helpfully and concisely to the latest customer message.',
    });

    const message = await this.messagesRepository.create({
      conversationId,
      direction: 'outbound',
      content: replyText,
      rawPayload: { source: 'ai-flow', provider: providerKey },
    });

    await this.conversationsRepository.touchLastMessageAt(conversationId, new Date());
    return message;
  }
}
