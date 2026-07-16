import { createHmac, timingSafeEqual } from 'node:crypto';
import { appConfig } from '../../config/app.config.js';
import type {
  ChannelProvider,
  ChannelWebhookEvent,
  OAuthAuthorizationRequest,
  OAuthTokenResult,
  WebhookVerificationRequest,
} from '../../application/interfaces/channel-provider.interface.js';

const GRAPH_API_VERSION = 'v21.0';
const GRAPH_API_BASE = `https://graph.facebook.com/${GRAPH_API_VERSION}`;

/**
 * Instagram provider (via Facebook Login for Business — the correct OAuth
 * path for Instagram Business messaging automation, not Basic Display).
 *
 * Scope note (Milestone 8 "skeleton"): connects the account and verifies
 * the OAuth + webhook plumbing end to end. It deliberately takes the
 * FIRST Facebook Page (with a linked Instagram Business Account) found
 * for the authorizing user — supporting a page-picker UI for users who
 * manage multiple Pages is a real, but separate, future enhancement, not
 * a bug in this milestone's scope.
 */
export class InstagramProvider implements ChannelProvider {
  readonly key = 'instagram';

  getAuthorizationUrl({ state, redirectUri }: OAuthAuthorizationRequest): string {
    const params = new URLSearchParams({
      client_id: appConfig.instagram.appId,
      redirect_uri: redirectUri,
      state,
      response_type: 'code',
      scope: [
        'instagram_basic',
        'instagram_manage_messages',
        'pages_show_list',
        'pages_manage_metadata',
      ].join(','),
    });

    return `https://www.facebook.com/${GRAPH_API_VERSION}/dialog/oauth?${params.toString()}`;
  }

  async exchangeCodeForToken(code: string, redirectUri: string): Promise<OAuthTokenResult> {
    const tokenUrl = new URL(`${GRAPH_API_BASE}/oauth/access_token`);
    tokenUrl.searchParams.set('client_id', appConfig.instagram.appId);
    tokenUrl.searchParams.set('client_secret', appConfig.instagram.appSecret);
    tokenUrl.searchParams.set('redirect_uri', redirectUri);
    tokenUrl.searchParams.set('code', code);

    const tokenResponse = await fetch(tokenUrl);
    const tokenBody = (await tokenResponse.json()) as {
      access_token?: string;
      expires_in?: number;
      error?: { message: string };
    };

    if (!tokenResponse.ok || !tokenBody.access_token) {
      throw new Error(
        `Instagram token exchange failed: ${tokenBody.error?.message ?? tokenResponse.statusText}`,
      );
    }

    const userAccessToken = tokenBody.access_token;
    const expiresAt = tokenBody.expires_in
      ? new Date(Date.now() + tokenBody.expires_in * 1000)
      : null;

    const instagramAccountId = await this.resolveInstagramBusinessAccountId(userAccessToken);

    return { externalAccountId: instagramAccountId, accessToken: userAccessToken, expiresAt };
  }

  /**
   * Walks the user's Facebook Pages to find the first one with a linked
   * Instagram Business Account — required because Instagram messaging
   * automation operates through a connected Facebook Page, not a
   * standalone Instagram OAuth grant.
   */
  private async resolveInstagramBusinessAccountId(userAccessToken: string): Promise<string> {
    const pagesUrl = new URL(`${GRAPH_API_BASE}/me/accounts`);
    pagesUrl.searchParams.set('access_token', userAccessToken);
    pagesUrl.searchParams.set('fields', 'id,instagram_business_account');

    const pagesResponse = await fetch(pagesUrl);
    const pagesBody = (await pagesResponse.json()) as {
      data?: Array<{ id: string; instagram_business_account?: { id: string } }>;
      error?: { message: string };
    };

    if (!pagesResponse.ok) {
      throw new Error(`Failed to list Facebook Pages: ${pagesBody.error?.message ?? pagesResponse.statusText}`);
    }

    const pageWithInstagram = pagesBody.data?.find((page) => page.instagram_business_account);
    if (!pageWithInstagram?.instagram_business_account) {
      throw new Error(
        'No Facebook Page with a linked Instagram Business Account was found for this user.',
      );
    }

    return pageWithInstagram.instagram_business_account.id;
  }

  verifyWebhookChallenge({ mode, verifyToken, challenge }: WebhookVerificationRequest): string | null {
    if (mode !== 'subscribe' || !challenge) {
      return null;
    }
    if (verifyToken !== appConfig.instagram.webhookVerifyToken) {
      return null;
    }
    return challenge;
  }

  verifyWebhookSignature(rawBody: Buffer, signatureHeader: string | undefined): boolean {
    if (!signatureHeader?.startsWith('sha256=')) {
      return false;
    }

    const expectedSignature = createHmac('sha256', appConfig.instagram.appSecret)
      .update(rawBody)
      .digest('hex');
    const providedSignature = signatureHeader.slice('sha256='.length);

    const expectedBuffer = Buffer.from(expectedSignature, 'hex');
    const providedBuffer = Buffer.from(providedSignature, 'hex');

    // Lengths must match before timingSafeEqual (it throws otherwise) —
    // a length mismatch alone is sufficient to reject as invalid.
    if (expectedBuffer.length !== providedBuffer.length) {
      return false;
    }

    return timingSafeEqual(expectedBuffer, providedBuffer);
  }

  parseWebhookEvent(rawBody: Buffer): ChannelWebhookEvent[] {
    const payload = JSON.parse(rawBody.toString('utf8')) as {
      entry?: Array<{ id: string; messaging?: Array<Record<string, unknown>> }>;
    };

    if (!payload.entry) {
      return [];
    }

    return payload.entry.flatMap((entry) =>
      (entry.messaging ?? []).map((messagingEvent) => ({
        provider: this.key,
        externalAccountId: entry.id,
        eventType: 'message',
        payload: messagingEvent,
      })),
    );
  }
}
