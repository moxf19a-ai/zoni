import type { NextFunction, Request, Response } from 'express';
import { Router, type RequestHandler } from 'express';
import type { BillingRepository } from './interfaces/billing-repository.interface.js';
import type { ApiSuccessResponse } from '../../presentation/http/api-response.type.js';

export class BillingController {
  constructor(private readonly billingRepository: BillingRepository) {}

  getSubscription = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const sub = await this.billingRepository.getByUser(req.user!.id);
      res.status(200).json({ success: true, data: sub } satisfies ApiSuccessResponse<unknown>);
    } catch (error) {
      next(error);
    }
  };

  subscribe = async (
    req: Request<unknown, unknown, { plan: string }>,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const sub = await this.billingRepository.upsert(req.user!.id, req.body.plan);
      res.status(200).json({ success: true, data: sub } satisfies ApiSuccessResponse<unknown>);
    } catch (error) {
      next(error);
    }
  };
}

export function createBillingRouter(controller: BillingController, authenticate: RequestHandler): Router {
  const router = Router();
  router.get('/', authenticate, controller.getSubscription);
  router.post('/', authenticate, controller.subscribe);
  return router;
}
