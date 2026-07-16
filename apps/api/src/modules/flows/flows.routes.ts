import { Router, type RequestHandler } from 'express';
import type { FlowsController } from './flows.controller.js';

export function createFlowsRouter(controller: FlowsController, authenticate: RequestHandler): Router {
  const router = Router();
  router.post('/:conversationId/auto-reply', authenticate, controller.generateAutoReply);
  return router;
}
