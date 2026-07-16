import type { NextFunction, Request, Response } from 'express';
import { Router, type RequestHandler } from 'express';
import type { ContactsRepository } from '../messaging/interfaces/contacts-repository.interface.js';
import type { ConversationsRepository } from '../messaging/interfaces/conversations-repository.interface.js';
import type { ApiSuccessResponse } from '../../presentation/http/api-response.type.js';

export class AnalyticsController {
  constructor(
    private readonly contactsRepository: ContactsRepository,
    private readonly conversationsRepository: ConversationsRepository,
  ) {}

  summary = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const [contacts, conversations] = await Promise.all([
        this.contactsRepository.listByUser(req.user!.id),
        this.conversationsRepository.listByUser(req.user!.id),
      ]);
      res.status(200).json({
        success: true,
        data: { totalContacts: contacts.length, totalConversations: conversations.length },
      } satisfies ApiSuccessResponse<unknown>);
    } catch (error) {
      next(error);
    }
  };
}

export function createAnalyticsRouter(
  controller: AnalyticsController,
  authenticate: RequestHandler,
): Router {
  const router = Router();
  router.get('/summary', authenticate, controller.summary);
  return router;
}
