import type { NextFunction, Request, Response } from 'express';
import type { FlowsService } from './flows.service.js';
import type { ConversationsRepository } from '../messaging/interfaces/conversations-repository.interface.js';
import { ConversationNotFoundError } from '../messaging/messaging.errors.js';
import type { ApiSuccessResponse } from '../../presentation/http/api-response.type.js';

export class FlowsController {
  constructor(
    private readonly flowsService: FlowsService,
    private readonly conversationsRepository: ConversationsRepository,
  ) {}

  generateAutoReply = async (
    req: Request<{ conversationId: string }, unknown, { provider: string }>,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const conversation = await this.conversationsRepository.findById(req.params.conversationId);
      if (!conversation || conversation.userId !== req.user!.id) {
        throw new ConversationNotFoundError(`Conversation "${req.params.conversationId}" was not found.`);
      }

      const message = await this.flowsService.generateAutoReply(
        req.params.conversationId,
        req.body.provider,
      );
      res.status(201).json({ success: true, data: message } satisfies ApiSuccessResponse<unknown>);
    } catch (error) {
      next(error);
    }
  };
}
