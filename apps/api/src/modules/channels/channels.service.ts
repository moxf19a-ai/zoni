import type { ChannelProviderRegistry } from './channel-provider.registry.js';
import type { ChannelConnectionsRepository } from './interfaces/channel-connections-repository.interface.js';
import type { OAuthStateService } from './interfaces/oauth-state.interface.js';
import type { TokenCipher } from '../../application/interfaces/token-cipher.interface.js';
import type { EventBus } from '../../application/interfaces/event-bus.interface.js';
import type { Logger } from '../../application/interfaces/logger.interface.js';
import {
  UnknownChannelProviderError,
  InvalidOAuthStateError,
  ChannelConnectionFailedError,
  ChannelAlreadyConnectedError,
} from './channels.errors.js';

export class ChannelsService {
  constructor(
    private readonly registry: ChannelProviderRegistry,
    private readonly connectionsRepository: ChannelConnectionsRepository,
    private readonly oauthStateService: OAuthStateService,
    private readonly tokenCipher: TokenCipher,
    private readonly eventBus: EventBus,
    private readonly logger: Logger,
  ) {}

  /** Step 1 of the OAuth connect flow: build the URL the browser redirects the user to. */
  initiateConnection(providerKey: string, userId: string, redirectUri: string): string {
    const provider = this.getProviderOrThrow(providerKey);
    const state = this.oauthStateService.sign({ userId, provider: providerKey });
    return provider.getAuthorizationUrl({ state, redirectUri });
  }

  /** Step 2: the provider redirects back here with a `code` + our `state`. */
  async completeConnection(providerKey: string, code: string, state: string, redirectUri: string) {
    const provider = this.getProviderOrThrow(providerKey);

    let statePayload;
    try {
      statePayload = this.oauthStateService.verify(state);
    } catch {
      throw new InvalidOAuthStateError('The OAuth state is invalid or has expired. Please try connecting again.');
    }

    if (statePayload.provider !== providerKey) {
      throw new InvalidOAuthStateError('OAuth state does not match the requested provider.');
    }

    let tokenResult;
    try {
      tokenResult = await provider.exchangeCodeForToken(code, redirectUri);
    } catch (error) {
      this.logger.error('Channel OAuth token exchange failed', { provider: providerKey, error });
      throw new ChannelConnectionFailedError(
        `Could not complete the connection to ${providerKey}. Please try again.`,
      );
    }

    let connection;
    try {
      connection = await this.connectionsRepository.upsert({
        userId: statePayload.userId,
        provider: providerKey,
        externalAccountId: tokenResult.externalAccountId,
        accessToken: this.tokenCipher.encrypt(tokenResult.accessToken),
        tokenExpiresAt: tokenResult.expiresAt,
      });
    } catch (error) {
      // Prisma's unique-constraint violation (P2002) on
      // `@@unique([provider, externalAccountId])` — this external account
      // is already connected to a DIFFERENT user. Duck-typed check (not
      // `instanceof PrismaClientKnownRequestError`) because importing that
      // class requires the generated client, which isn't always available
      // (see docs on the Prisma engine sandbox limitation).
      const isUniqueConstraintViolation =
        typeof error === 'object' && error !== null && 'code' in error && error.code === 'P2002';

      if (isUniqueConstraintViolation) {
        throw new ChannelAlreadyConnectedError(
          `This ${providerKey} account is already connected to a different user.`,
        );
      }
      throw error;
    }

    this.eventBus.publish('channel.connected', {
      userId: statePayload.userId,
      provider: providerKey,
      externalAccountId: tokenResult.externalAccountId,
    });

    return { id: connection.id, provider: connection.provider, status: connection.status };
  }

  /** Safe view for the frontend — never includes the encrypted access token. */
  async listConnections(userId: string) {
    const connections = await this.connectionsRepository.listByUserId(userId);
    return connections.map((c) => ({
      provider: c.provider,
      status: c.status,
      externalAccountId: c.externalAccountId,
    }));
  }

  /** Meta's webhook verification handshake (GET). */
  verifyWebhook(providerKey: string, mode: string | undefined, verifyToken: string | undefined, challenge: string | undefined): string | null {
    const provider = this.getProviderOrThrow(providerKey);
    return provider.verifyWebhookChallenge({ mode, verifyToken, challenge });
  }

  /**
   * Handles an incoming webhook POST (skeleton): verifies the signature,
   * normalizes the payload, and publishes each event on the Event Bus.
   * Actual message processing (Contacts, Conversations, AI replies) is
   * Milestone 9 — this milestone's job ends at "received, verified, and
   * announced".
   */
  receiveWebhook(providerKey: string, rawBody: Buffer, signatureHeader: string | undefined): void {
    const provider = this.getProviderOrThrow(providerKey);

    if (!provider.verifyWebhookSignature(rawBody, signatureHeader)) {
      this.logger.warn('Rejected webhook with invalid signature', { provider: providerKey });
      return;
    }

    const events = provider.parseWebhookEvent(rawBody);
    for (const event of events) {
      this.eventBus.publish('channel.webhook.received', event);
    }
  }

  private getProviderOrThrow(providerKey: string) {
    const provider = this.registry.get(providerKey);
    if (!provider) {
      throw new UnknownChannelProviderError(`Unknown channel provider: "${providerKey}".`);
    }
    return provider;
  }
}
