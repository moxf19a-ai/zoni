import { describe, it, expect, beforeAll } from 'vitest';

beforeAll(() => {
  process.env.NODE_ENV = 'test';
  process.env.DATABASE_URL = 'postgresql://user:pass@localhost:5432/db';
  process.env.JWT_ACCESS_SECRET = 'a'.repeat(32);
  process.env.OAUTH_STATE_SECRET = 'b'.repeat(32);
  process.env.CHANNEL_TOKEN_ENCRYPTION_KEY = 'c'.repeat(64);
  process.env.INSTAGRAM_APP_ID = 'x';
  process.env.INSTAGRAM_APP_SECRET = 'y';
  process.env.INSTAGRAM_WEBHOOK_VERIFY_TOKEN = 'z';
});

describe('AesTokenCipher', () => {
  it('encrypts and decrypts back to the original value', async () => {
    const { AesTokenCipher } = await import('../infrastructure/security/aes-token-cipher.js');
    const cipher = new AesTokenCipher();
    const original = 'super-secret-access-token';
    const encrypted = cipher.encrypt(original);
    expect(encrypted).not.toBe(original);
    expect(cipher.decrypt(encrypted)).toBe(original);
  });

  it('rejects a tampered ciphertext', async () => {
    const { AesTokenCipher } = await import('../infrastructure/security/aes-token-cipher.js');
    const cipher = new AesTokenCipher();
    const encrypted = cipher.encrypt('hello');
    const tampered = encrypted.slice(0, -1) + (encrypted.endsWith('0') ? '1' : '0');
    expect(() => cipher.decrypt(tampered)).toThrow();
  });
});
