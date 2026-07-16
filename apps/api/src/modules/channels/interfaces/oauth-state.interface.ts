/**
 * Signs/verifies the OAuth `state` parameter used during a channel
 * connect flow. Deliberately separate from modules/auth's TokenService:
 * that service signs access/refresh tokens for LOGGED-IN sessions (a
 * different purpose, different secret, different payload shape). Mixing
 * the two would mean a leaked OAuth state could be replayed against
 * auth-protected routes, or vice versa — separate secrets keep the blast
 * radius of either leaking contained to its own purpose.
 */
export interface OAuthStatePayload {
  userId: string;
  provider: string;
}

export interface OAuthStateService {
  sign(payload: OAuthStatePayload): string;
  verify(state: string): OAuthStatePayload;
}
