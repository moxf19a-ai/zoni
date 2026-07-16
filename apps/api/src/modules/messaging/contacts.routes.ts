import { Router, type RequestHandler } from 'express';
import type { MessagingController } from './messaging.controller.js';

export function createContactsRouter(
  controller: MessagingController,
  authenticate: RequestHandler,
): Router {
  const router = Router();
  router.get('/', authenticate, controller.listContacts);
  return router;
}
