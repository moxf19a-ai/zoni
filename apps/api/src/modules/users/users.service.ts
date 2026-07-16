import type { UsersRepository, UserRecord, CreateUserData } from './interfaces/users-repository.interface.js';
import type { PublicUser } from './users.types.js';

function toPublicUser(user: UserRecord): PublicUser {
  return {
    id: user.id,
    email: user.email,
    fullName: user.fullName,
    createdAt: user.createdAt,
  };
}

export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  /** Internal use only (e.g. by AuthService to check the password hash) — never exposed via a controller. */
  async findByEmail(email: string): Promise<UserRecord | null> {
    return this.usersRepository.findByEmail(email);
  }

  async findPublicById(id: string): Promise<PublicUser | null> {
    const user = await this.usersRepository.findById(id);
    return user ? toPublicUser(user) : null;
  }

  async createUser(data: CreateUserData): Promise<PublicUser> {
    const user = await this.usersRepository.create(data);
    return toPublicUser(user);
  }
}
