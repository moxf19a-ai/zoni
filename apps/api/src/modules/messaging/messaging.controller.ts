import type { NextFunction, Request, Response } from 'express';
import type { MessagingQueryService } from './messaging-query.service.js';
import type { ApiSuccessResponse } from '../../presentation/http/api-response.type.js';

export class MessagingController {
  constructor(private readonly queryService: MessagingQueryService) {}

  listContacts = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const contacts = await this.queryService.listContacts(req.user!.id);
      res.status(200).json({ success: true, data: contacts } satisfies ApiSuccessResponse<unknown>);
    } catch (error) {
      next(error);
    }
  };

  listConversations = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const conversations = await this.queryService.listConversations(req.user!.id);
      res
        .status(200)
        .json({ success: true, data: conversations } satisfies ApiSuccessResponse<unknown>);
    } catch (error) {
      next(error);
    }
  };

  listMessages = async (
    req: Request<{ conversationId: string }>,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const messages = await this.queryService.listMessages(req.user!.id, req.params.conversationId);
      res.status(200).json({ success: true, data: messages } satisfies ApiSuccessResponse<unknown>);
    } catch (error) {
      next(error);
    }
  };
}
