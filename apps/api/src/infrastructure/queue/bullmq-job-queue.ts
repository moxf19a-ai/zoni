import { Queue, Worker } from 'bullmq';
import type { JobQueue } from '../../application/interfaces/job-queue.interface.js';
import { appConfig } from '../../config/app.config.js';
import type { Logger } from '../../application/interfaces/logger.interface.js';

const connection = { url: appConfig.redisUrl };

export class BullMqJobQueue implements JobQueue {
  private readonly queues = new Map<string, Queue>();

  constructor(private readonly logger: Logger) {}

  private getQueue(jobName: string): Queue {
    let queue = this.queues.get(jobName);
    if (!queue) {
      queue = new Queue(jobName, { connection });
      this.queues.set(jobName, queue);
    }
    return queue;
  }

  async enqueue<TPayload = unknown>(jobName: string, payload: TPayload): Promise<void> {
    await this.getQueue(jobName).add(jobName, payload as object);
  }

  process<TPayload = unknown>(jobName: string, handler: (payload: TPayload) => Promise<void>): void {
    const worker = new Worker(
      jobName,
      async (job) => {
        await handler(job.data as TPayload);
      },
      { connection },
    );
    worker.on('failed', (job, error) => {
      this.logger.error(`Job "${jobName}" failed`, { jobId: job?.id, error });
    });
  }
}
