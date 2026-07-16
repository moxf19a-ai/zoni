export interface AccessTokenPayload {
  sub: string;
  email: string;
}

export interface GeneratedRefreshToken {
  token: string;
  tokenHash: string;
  expiresAt: Date;
}

export interface TokenService {
  signAccessToken(payload: AccessTokenPayload): string;
  verifyAccessToken(token: string): AccessTokenPayload;
  /** Generates a new opaque refresh token, its hash (for storage), and its expiry. */
  generateRefreshToken(): GeneratedRefreshToken;
  /** Hashes a raw refresh token the same way `generateRefreshToken` did, for lookup by hash. */
  hashRefreshToken(token: string): string;
}
