import { createCipheriv, createDecipheriv, randomBytes } from 'node:crypto';
import { appConfig } from '../../config/app.config.js';
import type { TokenCipher } from '../../application/interfaces/token-cipher.interface.js';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH_BYTES = 12; // recommended IV length for GCM

/**
 * AES-256-GCM implementation of TokenCipher. Output format is
 * `<iv>:<authTag>:<cipherText>`, each segment hex-encoded — a fresh
 * random IV per encryption call (required for GCM's security guarantees;
 * reusing an IV with the same key breaks confidentiality).
 */
export class AesTokenCipher implements TokenCipher {
  private readonly key: Buffer;

  constructor() {
    this.key = Buffer.from(appConfig.security.channelTokenEncryptionKey, 'hex');
  }

  encrypt(plainText: string): string {
    const iv = randomBytes(IV_LENGTH_BYTES);
    const cipher = createCipheriv(ALGORITHM, this.key, iv);
    const encrypted = Buffer.concat([cipher.update(plainText, 'utf8'), cipher.final()]);
    const authTag = cipher.getAuthTag();

    return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted.toString('hex')}`;
  }

  decrypt(cipherText: string): string {
    const [ivHex, authTagHex, encryptedHex] = cipherText.split(':');
    if (!ivHex || !authTagHex || !encryptedHex) {
      throw new Error('Invalid encrypted token format.');
    }

    const decipher = createDecipheriv(ALGORITHM, this.key, Buffer.from(ivHex, 'hex'));
    decipher.setAuthTag(Buffer.from(authTagHex, 'hex'));

    const decrypted = Buffer.concat([
      decipher.update(Buffer.from(encryptedHex, 'hex')),
      decipher.final(),
    ]);

    return decrypted.toString('utf8');
  }
}
