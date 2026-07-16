import { Redis } from 'ioredis';
import type { Cache } from '../../application/interfaces/cache.interface.js';
import { appConfig } from '../../config/app.config.js';

export class RedisCache implements Cache {
  private readonly client: InstanceType<typeof Redis>;

  constructor() {
    this.client = new Redis(appConfig.redisUrl);
  }

  async get<T = unknown>(key: string): Promise<T | null> {
    const raw = await this.client.get(key);
    return raw ? (JSON.parse(raw) as T) : null;
  }

  async set(key: string, value: unknown, ttlSeconds?: number): Promise<void> {
    const serialized = JSON.stringify(value);
    if (ttlSeconds) {
      await this.client.set(key, serialized, 'EX', ttlSeconds);
    } else {
      await this.client.set(key, serialized);
    }
  }

  async del(key: string): Promise<void> {
    await this.client.del(key);
  }
}
