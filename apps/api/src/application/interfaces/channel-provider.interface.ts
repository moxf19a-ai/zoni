/**
 * Channel Provider abstraction (Application layer port) — the core of the
 * Plugin System. Every messaging channel (Instagram today; Facebook,
 * WhatsApp, Telegram, TikTok, Email in future milestones) implements this
 * SAME interface. The rest of the application (ChannelsService,
 * ChannelsController) depends only on this abstraction, never on a
 * specific provider — so adding a new provider later means writing one
 * new class and registering it, with zero changes to existing code.
 *
 * No provider depends on another — each is a fully self-contained
 * implementation living in its own `infrastructure/channels/*` file.
 */

export interface OAuthAuthorizationRequest {
  state: string;
  redirectUri: string;
}

export interface OAuthTokenResult {
  externalAccountId: string;
  accessToken: string;
  expiresAt: Date | null;
}

export interface WebhookVerificationRequest {
  mode: string | undefined;
  verifyToken: string | undefined;
  challenge: string | undefined;
}

export interface ChannelWebhookEvent {
  provider: string;
  externalAccountId: string;
  eventType: string;
  payload: unknown;
}

export interface ChannelProvider {
  /** Stable machine-readable key, e.g. "instagram". Used as the DB `provider` column value. */
  readonly key: string;

  /** Builds the URL the user's browser is redirected to in order to grant access. */
  getAuthorizationUrl(request: OAuthAuthorizationRequest): string;

  /** Exchanges the OAuth `code` (from the callback redirect) for a usable access token. */
  exchangeCodeForToken(code: string, redirectUri: string): Promise<OAuthTokenResult>;

  /**
   * Handles the provider's webhook verification handshake (e.g. Meta's
   * `hub.challenge` flow). Returns the value to echo back if valid, or
   * `null` if the request should be rejected.
   */
  verifyWebhookChallenge(request: WebhookVerificationRequest): string | null;

  /**
   * Verifies the webhook request actually came from the provider (e.g.
   * HMAC signature check). Requires the RAW request body bytes — signing
   * schemes operate on the exact bytes sent, not the re-serialized JSON.
   */
  verifyWebhookSignature(rawBody: Buffer, signatureHeader: string | undefined): boolean;

  /**
   * Normalizes a provider's raw webhook payload into a generic event
   * list. This milestone only normalizes and emits events via the Event
   * Bus (skeleton) — actually processing messages is Milestone 9.
   */
  parseWebhookEvent(rawBody: Buffer): ChannelWebhookEvent[];
}
