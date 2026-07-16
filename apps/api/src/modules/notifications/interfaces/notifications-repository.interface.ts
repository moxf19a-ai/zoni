export interface NotificationRecord {
  id: string;
  userId: string;
  type: string;
  message: string;
  readAt: Date | null;
  createdAt: Date;
}

export interface NotificationsRepository {
  create(userId: string, type: string, message: string): Promise<NotificationRecord>;
  listByUser(userId: string): Promise<NotificationRecord[]>;
  markRead(id: string): Promise<void>;
}
