/**
 * Mirrors apps/api/src/modules/auth/dto/auth.dto.ts (AuthTokensDto).
 * The backend's /register and /login responses return ONLY these two
 * tokens — no user object. Any user-facing info (email, id) is derived
 * client-side by decoding the access token's payload (see
 * utils/jwt.ts) — the API contract is locked (Milestone 5) and not
 * re-opened here.
 */
export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

/**
 * Shape of the access token's JWT payload, mirroring
 * apps/api/src/modules/auth/interfaces/token-service.interface.ts
 * (AccessTokenPayload). Decoded client-side for display purposes only —
 * the frontend never verifies the signature; verification is the
 * backend's job on every authenticated request.
 */
export interface AccessTokenPayload {
  sub: string;
  email: string;
  iat: number;
  exp: number;
}

export interface AuthenticatedUser {
  id: string;
  email: string;
}

export interface RegisterFormValues {
  email: string;
  password: string;
  fullName: string;
}

export interface LoginFormValues {
  email: string;
  password: string;
}
