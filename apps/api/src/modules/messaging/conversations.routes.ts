import { Router, type RequestHandler } from 'express';
import type { MessagingController } from './messaging.controller.js';

export function createConversationsRouter(
  controller: MessagingController,
  authenticate: RequestHandler,
): Router {
  const router = Router();
  router.get('/', authenticate, controller.listConversations);
  router.get('/:conversationId/messages', authenticate, controller.listMessages);
  return router;
}
