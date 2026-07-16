/**
 * Reversible-encryption abstraction (Application layer port) for secrets
 * that must be READ BACK later (e.g. a channel's OAuth access token, used
 * to call that provider's API). This is deliberately distinct from
 * password/refresh-token hashing (modules/auth) — those only ever need
 * equality checks and are irreversible by design; this is the opposite:
 * reversible by design, because the raw value is genuinely needed again.
 */
export interface TokenCipher {
  encrypt(plainText: string): string;
  decrypt(cipherText: string): string;
}
