import { env } from './env.js';
import { developmentConfig } from './environments/development.js';
import { productionConfig } from './environments/production.js';
import { testConfig } from './environments/test.js';

/**
 * Single source of truth for application configuration.
 *
 * Merges two things:
 * 1. `env` — validated process.env values (env.ts), identical across
 *    environments in *shape*, different only in *value* (PORT, DATABASE_URL).
 * 2. The environment-specific file matching `env.NODE_ENV` — values that
 *    differ in *behavior* between environments (log verbosity, timeouts).
 *
 * Every future module reads configuration from here, never from
 * `process.env` directly and never by re-implementing environment
 * branching logic elsewhere.
 */
const configByEnvironment = {
  development: developmentConfig,
  production: productionConfig,
  test: testConfig,
} as const;

export const appConfig = {
  nodeEnv: env.NODE_ENV,
  port: env.PORT,
  databaseUrl: env.DATABASE_URL,
  publicBaseUrl: env.API_PUBLIC_BASE_URL,
  jwtAccessSecret: env.JWT_ACCESS_SECRET,
  jwtAccessExpiresIn: env.JWT_ACCESS_EXPIRES_IN,
  jwtRefreshExpiresInMs: env.JWT_REFRESH_EXPIRES_IN_DAYS * 24 * 60 * 60 * 1000,
  security: {
    corsAllowedOrigins: env.CORS_ALLOWED_ORIGINS,
    rateLimitWindowMs: env.RATE_LIMIT_WINDOW_MS,
    rateLimitMaxRequests: env.RATE_LIMIT_MAX_REQUESTS,
    rateLimitAuthMaxRequests: env.RATE_LIMIT_AUTH_MAX_REQUESTS,
    oauthStateSecret: env.OAUTH_STATE_SECRET,
    channelTokenEncryptionKey: env.CHANNEL_TOKEN_ENCRYPTION_KEY,
  },
  redisUrl: env.REDIS_URL,
  ai: {
    openaiApiKey: env.OPENAI_API_KEY,
    claudeApiKey: env.CLAUDE_API_KEY,
    geminiApiKey: env.GEMINI_API_KEY,
  },
  instagram: {
    appId: env.INSTAGRAM_APP_ID,
    appSecret: env.INSTAGRAM_APP_SECRET,
    webhookVerifyToken: env.INSTAGRAM_WEBHOOK_VERIFY_TOKEN,
    redirectUri: `${env.API_PUBLIC_BASE_URL}/api/v1/channels/instagram/callback`,
  },
  ...configByEnvironment[env.NODE_ENV],
};

export type AppConfig = typeof appConfig;
