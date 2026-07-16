import type { NextFunction, Request, Response } from 'express';
import { Router, type RequestHandler } from 'express';
import type { NotificationsRepository } from './interfaces/notifications-repository.interface.js';
import type { ApiSuccessResponse } from '../../presentation/http/api-response.type.js';

export class NotificationsController {
  constructor(private readonly notificationsRepository: NotificationsRepository) {}

  list = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const items = await this.notificationsRepository.listByUser(req.user!.id);
      res.status(200).json({ success: true, data: items } satisfies ApiSuccessResponse<unknown>);
    } catch (error) {
      next(error);
    }
  };

  markRead = async (req: Request<{ id: string }>, res: Response, next: NextFunction): Promise<void> => {
    try {
      await this.notificationsRepository.markRead(req.params.id);
      res.status(200).json({ success: true, data: null } satisfies ApiSuccessResponse<null>);
    } catch (error) {
      next(error);
    }
  };
}

export function createNotificationsRouter(
  controller: NotificationsController,
  authenticate: RequestHandler,
): Router {
  const router = Router();
  router.get('/', authenticate, controller.list);
  router.post('/:id/read', authenticate, controller.markRead);
  return router;
}
