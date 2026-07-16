import 'dotenv/config';
import { z } from 'zod';

/**
 * Validates the environment variables this application actually reads today.
 *
 * Scope note: intentionally grows milestone by milestone — PORT (M2),
 * DATABASE_URL (M3), JWT_* (M5), CORS_*, RATE_LIMIT_* (M6), Instagram/
 * channel encryption vars (M8). This file is superseded/extended in
 * place, never duplicated elsewhere.
 */
const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(4000),
  DATABASE_URL: z
    .string()
    .min(1, 'DATABASE_URL is required')
    .regex(/^postgresql:\/\//, 'DATABASE_URL must be a valid PostgreSQL connection string'),
  JWT_ACCESS_SECRET: z
    .string()
    .min(32, 'JWT_ACCESS_SECRET must be at least 32 characters long.'),
  JWT_ACCESS_EXPIRES_IN: z.string().default('15m'),
  JWT_REFRESH_EXPIRES_IN_DAYS: z.coerce.number().int().positive().default(30),
  CORS_ALLOWED_ORIGINS: z
    .string()
    .default('http://localhost:5173')
    .transform((value) => value.split(',').map((origin) => origin.trim()).filter(Boolean)),
  RATE_LIMIT_WINDOW_MS: z.coerce.number().int().positive().default(15 * 60 * 1000),
  RATE_LIMIT_MAX_REQUESTS: z.coerce.number().int().positive().default(300),
  RATE_LIMIT_AUTH_MAX_REQUESTS: z.coerce.number().int().positive().default(10),
  API_PUBLIC_BASE_URL: z
    .string()
    .url('API_PUBLIC_BASE_URL must be a valid URL.')
    .default('http://localhost:4000'),
  OAUTH_STATE_SECRET: z
    .string()
    .min(32, 'OAUTH_STATE_SECRET must be at least 32 characters long.'),
  CHANNEL_TOKEN_ENCRYPTION_KEY: z
    .string()
    .length(64, 'CHANNEL_TOKEN_ENCRYPTION_KEY must be a 64-character hex string (32 bytes). Generate with: openssl rand -hex 32'),
  INSTAGRAM_APP_ID: z.string().min(1, 'INSTAGRAM_APP_ID is required'),
  INSTAGRAM_APP_SECRET: z.string().min(1, 'INSTAGRAM_APP_SECRET is required'),
  INSTAGRAM_WEBHOOK_VERIFY_TOKEN: z.string().min(1, 'INSTAGRAM_WEBHOOK_VERIFY_TOKEN is required'),
  OPENAI_API_KEY: z.string().default(''),
  CLAUDE_API_KEY: z.string().default(''),
  GEMINI_API_KEY: z.string().default(''),
  REDIS_URL: z.string().default('redis://localhost:6379'),
});

export type Env = z.infer<typeof envSchema>;

function loadEnv(): Env {
  const parsed = envSchema.safeParse(process.env);

  if (!parsed.success) {
    // eslint-disable-next-line no-console
    console.error('Invalid environment variables:');
    // eslint-disable-next-line no-console
    console.error(parsed.error.flatten().fieldErrors);
    throw new Error('Environment validation failed. See errors above.');
  }

  return parsed.data;
}

export const env: Env = loadEnv();
