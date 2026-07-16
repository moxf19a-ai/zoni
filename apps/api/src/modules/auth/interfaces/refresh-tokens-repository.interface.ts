export interface StoredRefreshToken {
  id: string;
  userId: string;
  expiresAt: Date;
}

export interface CreateRefreshTokenData {
  userId: string;
  tokenHash: string;
  expiresAt: Date;
}

export interface RefreshTokensRepository {
  create(data: CreateRefreshTokenData): Promise<void>;
  /** Returns the token only if it exists, is not revoked, and has not expired. */
  findValidByHash(tokenHash: string): Promise<StoredRefreshToken | null>;
  revoke(id: string): Promise<void>;
}
