import type { DatabaseClient } from '../../application/interfaces/database-client.type.js';
import type {
  CreateUserData,
  UserRecord,
  UsersRepository,
} from './interfaces/users-repository.interface.js';

export class PrismaUsersRepository implements UsersRepository {
  constructor(private readonly db: DatabaseClient) {}

  async findByEmail(email: string): Promise<UserRecord | null> {
    return this.db.user.findFirst({ where: { email } });
  }

  async findById(id: string): Promise<UserRecord | null> {
    return this.db.user.findFirst({ where: { id } });
  }

  async create(data: CreateUserData): Promise<UserRecord> {
    return this.db.user.create({ data });
  }
}
