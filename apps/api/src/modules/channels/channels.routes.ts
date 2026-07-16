import { Router, type RequestHandler } from 'express';
import type { ChannelsController } from './channels.controller.js';

export function createChannelsRouter(
  controller: ChannelsController,
  authenticate: RequestHandler,
): Router {
  const router = Router();

  router.get('/', authenticate, controller.list);
  router.get('/:provider/connect', authenticate, controller.connect);
  router.get('/:provider/callback', controller.callback);
  router.get('/:provider/webhook', controller.verifyWebhook);
  router.post('/:provider/webhook', controller.receiveWebhook);

  return router;
}
