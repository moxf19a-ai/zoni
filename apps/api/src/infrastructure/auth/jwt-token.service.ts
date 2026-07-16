import { createHash, randomBytes } from 'node:crypto';
import jwt from 'jsonwebtoken';
import { appConfig } from '../../config/app.config.js';
import type {
  AccessTokenPayload,
  GeneratedRefreshToken,
  TokenService,
} from '../../modules/auth/interfaces/token-service.interface.js';

/**
 * Concrete `TokenService` implementation.
 *
 * Access tokens: short-lived, stateless JWTs (signed with `JWT_ACCESS_SECRET`).
 * Refresh tokens: opaque random strings, NEVER stored raw — only their
 * SHA-256 hash is persisted (via `RefreshTokensRepository`). This lets the
 * platform revoke a refresh token on demand (rotation, logout, compromise),
 * which a purely stateless JWT refresh token could not do.
 */
export class JwtTokenService implements TokenService {
  signAccessToken(payload: AccessTokenPayload): string {
    return jwt.sign(payload, appConfig.jwtAccessSecret, {
      expiresIn: appConfig.jwtAccessExpiresIn,
    } as jwt.SignOptions);
  }

  verifyAccessToken(token: string): AccessTokenPayload {
    return jwt.verify(token, appConfig.jwtAccessSecret) as AccessTokenPayload;
  }

  generateRefreshToken(): GeneratedRefreshToken {
    const token = randomBytes(48).toString('hex');
    const tokenHash = this.hashRefreshToken(token);
    const expiresAt = new Date(Date.now() + appConfig.jwtRefreshExpiresInMs);

    return { token, tokenHash, expiresAt };
  }

  hashRefreshToken(token: string): string {
    return createHash('sha256').update(token).digest('hex');
  }
}
