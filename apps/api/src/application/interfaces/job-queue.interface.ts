export interface JobQueue {
  enqueue<TPayload = unknown>(jobName: string, payload: TPayload): Promise<void>;
  process<TPayload = unknown>(jobName: string, handler: (payload: TPayload) => Promise<void>): void;
}
