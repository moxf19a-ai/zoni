import type { NextFunction, Request, Response } from 'express';
import type { ChannelsService } from './channels.service.js';
import { validate } from '../../presentation/http/validate.js';
import { oauthCallbackQuerySchema } from './validation/oauth-callback.validation.js';
import { appConfig } from '../../config/app.config.js';
import { AppError } from '../../application/errors/app-error.js';
import type { ApiSuccessResponse } from '../../presentation/http/api-response.type.js';

export class ChannelsController {
  constructor(private readonly channelsService: ChannelsService) {}

  /** Protected: list the logged-in user's channel connections (never includes the access token). */
  list = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const connections = await this.channelsService.listConnections(req.user!.id);
      res.status(200).json({ success: true, data: connections } satisfies ApiSuccessResponse<unknown>);
    } catch (error) {
      next(error);
    }
  };

  /** Protected: the logged-in user starts a connect flow. Returns the URL for the frontend to redirect the browser to. */
  connect = (req: Request<{ provider: string }>, res: Response, next: NextFunction): void => {
    try {
      // req.user is guaranteed by the authenticate middleware mounted on this route.
      const userId = req.user!.id;
      const redirectUri = `${appConfig.publicBaseUrl}/api/v1/channels/${req.params.provider}/callback`;
      const authorizationUrl = this.channelsService.initiateConnection(
        req.params.provider,
        userId,
        redirectUri,
      );

      res.status(200).json({
        success: true,
        data: { authorizationUrl },
      } satisfies ApiSuccessResponse<{ authorizationUrl: string }>);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Public: the provider redirects the user's BROWSER here after they
   * approve (or deny) access. Unlike every other endpoint, errors here
   * must NOT go through the JSON error handler (`next(error)`) — the
   * user's browser is mid-redirect, not an API client, so a raw JSON
   * error page is a dead end. Both outcomes redirect back to the app.
   */
  callback = async (req: Request<{ provider: string }>, res: Response): Promise<void> => {
    const frontendOrigin = appConfig.security.corsAllowedOrigins[0] ?? '/';
    const provider = req.params.provider;

    try {
      const { code, state } = validate(oauthCallbackQuerySchema, req.query);
      const redirectUri = `${appConfig.publicBaseUrl}/api/v1/channels/${provider}/callback`;

      await this.channelsService.completeConnection(provider, code, state, redirectUri);

      res.redirect(`${frontendOrigin}/channels?connected=${provider}`);
    } catch (error) {
      const code = error instanceof AppError ? error.code : 'CHANNEL_CONNECTION_FAILED';
      res.redirect(`${frontendOrigin}/channels?error=${encodeURIComponent(code)}`);
    }
  };

  /** Public: provider's webhook verification handshake. */
  verifyWebhook = (req: Request<{ provider: string }>, res: Response, next: NextFunction): void => {
    try {
      const challengeResponse = this.channelsService.verifyWebhook(
        req.params.provider,
        req.query['hub.mode'] as string | undefined,
        req.query['hub.verify_token'] as string | undefined,
        req.query['hub.challenge'] as string | undefined,
      );

      if (challengeResponse === null) {
        res.status(403).end();
        return;
      }

      res.status(200).send(challengeResponse);
    } catch (error) {
      next(error);
    }
  };

  /** Public: provider posts events here. Must respond fast — processing is fire-and-forget via the Event Bus. */
  receiveWebhook = (req: Request<{ provider: string }>, res: Response, next: NextFunction): void => {
    try {
      // Requires express.json({ verify }) to have captured the raw bytes (see server.ts) —
      // signature verification operates on the exact bytes sent, not the re-serialized JSON.
      const rawBody = req.rawBody ?? Buffer.from(JSON.stringify(req.body));
      this.channelsService.receiveWebhook(
        req.params.provider,
        rawBody,
        req.header('x-hub-signature-256'),
      );

      // Always 200 quickly, even if the signature was rejected internally —
      // responding with an error status here would make Meta retry
      // aggressively and/or disable the webhook subscription.
      res.status(200).end();
    } catch (error) {
      next(error);
    }
  };
}
