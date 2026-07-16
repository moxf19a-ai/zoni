import type { AccessTokenPayload } from '../types/auth.types';

/**
 * Decodes a JWT's payload segment for DISPLAY PURPOSES ONLY. This never
 * verifies the signature — it cannot, without the server's secret, and
 * must not be trusted as an authentication decision. The backend
 * independently verifies every token on every authenticated request
 * (apps/api JwtTokenService.verifyAccessToken); this is purely so the UI
 * can show "logged in as {email}" without an extra network round trip.
 */
export function decodeAccessToken(token: string): AccessTokenPayload | null {
  try {
    const payloadSegment = token.split('.')[1];
    if (!payloadSegment) {
      return null;
    }

    const base64 = payloadSegment.replace(/-/g, '+').replace(/_/g, '/');
    const json = atob(base64);
    return JSON.parse(json) as AccessTokenPayload;
  } catch {
    return null;
  }
}

export function isTokenExpired(payload: AccessTokenPayload): boolean {
  return payload.exp * 1000 <= Date.now();
}
