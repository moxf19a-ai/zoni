import type { ChannelWebhookEvent } from '../../application/interfaces/channel-provider.interface.js';
import type { ChannelConnectionsRepository } from '../channels/interfaces/channel-connections-repository.interface.js';
import type { ContactsRepository } from './interfaces/contacts-repository.interface.js';
import type { ConversationsRepository } from './interfaces/conversations-repository.interface.js';
import type { MessagesRepository } from './interfaces/messages-repository.interface.js';
import type { Logger } from '../../application/interfaces/logger.interface.js';

/**
 * Shape of an Instagram (Meta Messenger-platform-family) messaging
 * webhook entry. Deliberately loose/partial — only the fields this
 * milestone's ingestion actually reads. Full message-type handling
 * (attachments, quick replies, postbacks...) is future scope.
 */
interface InstagramMessagingEvent {
  sender?: { id?: string };
  message?: { mid?: string; text?: string };
}

/**
 * Message ingestion pipeline (Milestone 9). Subscribes to the
 * `channel.webhook.received` event published by the Channels module
 * (Milestone 8) and turns a raw provider event into the platform's own
 * Contact → Conversation → Message records.
 *
 * This is intentionally the ONLY consumer of that event today — the
 * whole point of publishing through the Event Bus instead of calling this
 * service directly from ChannelsService is that Milestone 8 has zero
 * knowledge this module even exists. A future module (e.g. Analytics)
 * can subscribe to the exact same event with zero changes here.
 */
export class MessageIngestionService {
  constructor(
    private readonly channelConnectionsRepository: ChannelConnectionsRepository,
    private readonly contactsRepository: ContactsRepository,
    private readonly conversationsRepository: ConversationsRepository,
    private readonly messagesRepository: MessagesRepository,
    private readonly logger: Logger,
  ) {}

  async handleChannelWebhookEvent(event: ChannelWebhookEvent): Promise<void> {
    if (event.eventType !== 'message') {
      // Skeleton scope: only inbound messages are ingested today. Other
      // event types (e.g. read receipts, postbacks) are simply ignored
      // for now rather than guessed-at — handling them is future scope,
      // not a bug in this milestone.
      return;
    }

    const messagingEvent = event.payload as InstagramMessagingEvent;
    const externalContactId = messagingEvent.sender?.id;

    if (!externalContactId) {
      this.logger.warn('Ignoring channel webhook event with no sender id', {
        provider: event.provider,
      });
      return;
    }

    const connection = await this.channelConnectionsRepository.findByProviderAndExternalAccountId(
      event.provider,
      event.externalAccountId,
    );

    if (!connection) {
      // Expected in normal operation: e.g. a webhook arriving after the
      // user disconnected that channel. Not an error condition.
      this.logger.warn('Ignoring webhook event for an unknown/disconnected channel connection', {
        provider: event.provider,
        externalAccountId: event.externalAccountId,
      });
      return;
    }

    const contact = await this.contactsRepository.upsertByExternalId({
      userId: connection.userId,
      provider: event.provider,
      externalContactId,
    });

    const conversation = await this.conversationsRepository.findOrCreateByContact({
      userId: connection.userId,
      contactId: contact.id,
      provider: event.provider,
    });

    const externalMessageId = messagingEvent.message?.mid ?? null;

    // De-duplication: providers redeliver webhooks (at-least-once
    // delivery, not exactly-once — this is Meta's documented behavior,
    // not an edge case). Check first for a clear, fast no-op on the
    // common case...
    if (externalMessageId) {
      const existing = await this.messagesRepository.findByExternalMessageId(externalMessageId);
      if (existing) {
        this.logger.info('Skipping duplicate webhook redelivery for an already-ingested message', {
          provider: event.provider,
          externalMessageId,
        });
        return;
      }
    }

    try {
      await this.messagesRepository.create({
        conversationId: conversation.id,
        direction: 'inbound',
        externalMessageId,
        content: messagingEvent.message?.text ?? null,
        rawPayload: event.payload,
      });
    } catch (error) {
      // ...and fall back to catching the unique-constraint violation
      // (Prisma error code P2002) as a safety net for the race window
      // between the check above and this insert, if two redeliveries of
      // the same message arrive milliseconds apart. Duck-typed check for
      // the same reason as channels.service.ts: importing
      // PrismaClientKnownRequestError requires the generated client.
      const isDuplicateMessage =
        typeof error === 'object' && error !== null && 'code' in error && error.code === 'P2002';

      if (!isDuplicateMessage) {
        throw error;
      }

      this.logger.info('Skipping duplicate message insert caught by the database constraint', {
        provider: event.provider,
        externalMessageId,
      });
      return;
    }

    await this.conversationsRepository.touchLastMessageAt(conversation.id, new Date());
  }
}
