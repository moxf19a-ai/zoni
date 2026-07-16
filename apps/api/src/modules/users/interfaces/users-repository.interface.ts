import type { PublicUser } from '../users.types.js';

/** Internal record shape — includes `passwordHash`, never returned to callers outside this module. */
export interface UserRecord extends PublicUser {
  passwordHash: string;
}

export interface CreateUserData {
  email: string;
  passwordHash: string;
  fullName: string;
}

export interface UsersRepository {
  findByEmail(email: string): Promise<UserRecord | null>;
  findById(id: string): Promise<UserRecord | null>;
  create(data: CreateUserData): Promise<UserRecord>;
}
