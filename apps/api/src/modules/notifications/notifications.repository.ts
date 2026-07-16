import type { DatabaseClient } from '../../application/interfaces/database-client.type.js';
import type {
  NotificationRecord,
  NotificationsRepository,
} from './interfaces/notifications-repository.interface.js';

export class PrismaNotificationsRepository implements NotificationsRepository {
  constructor(private readonly db: DatabaseClient) {}

  async create(userId: string, type: string, message: string): Promise<NotificationRecord> {
    return this.db.notification.create({ data: { userId, type, message } });
  }

  async listByUser(userId: string): Promise<NotificationRecord[]> {
    return this.db.notification.findMany({ where: { userId }, orderBy: { createdAt: 'desc' } });
  }

  async markRead(id: string): Promise<void> {
    await this.db.notification.update({ where: { id }, data: { readAt: new Date() } });
  }
}
