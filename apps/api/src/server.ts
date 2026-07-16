import express, { type Request, type Response } from 'express';
import { appConfig } from './config/app.config.js';
import { prisma } from './infrastructure/database/prisma-client.js';
import { logger } from './infrastructure/logging/pino-logger.js';
import { eventBus } from './infrastructure/events/event-bus.js';
import { requestIdMiddleware } from './presentation/http/middlewares/request-id.middleware.js';
import { notFoundMiddleware } from './presentation/http/middlewares/not-found.middleware.js';
import { errorHandlerMiddleware } from './presentation/http/middlewares/error-handler.middleware.js';
import { securityHeadersMiddleware } from './presentation/http/middlewares/security/security-headers.middleware.js';
import { corsMiddleware } from './presentation/http/middlewares/security/cors.middleware.js';
import { sanitizeBodyMiddleware } from './presentation/http/middlewares/security/sanitize-body.middleware.js';
import { csrfProtectionMiddleware } from './presentation/http/middlewares/security/csrf-protection.middleware.js';
import { defaultRateLimiter, authRateLimiter } from './presentation/http/middlewares/security/rate-limit.middleware.js';
import { PrismaUsersRepository } from './modules/users/users.repository.js';
import { UsersService } from './modules/users/users.service.js';
import { PrismaRefreshTokensRepository } from './modules/auth/refresh-tokens.repository.js';
import { JwtTokenService } from './infrastructure/auth/jwt-token.service.js';
import { BcryptPasswordHasher } from './infrastructure/auth/bcrypt-password-hasher.js';
import { AuthService } from './modules/auth/auth.service.js';
import { AuthController } from './modules/auth/auth.controller.js';
import { createAuthRouter } from './modules/auth/auth.routes.js';
import { createAuthenticateMiddleware } from './presentation/http/middlewares/authenticate.middleware.js';
import { ChannelProviderRegistry } from './modules/channels/channel-provider.registry.js';
import { PrismaChannelConnectionsRepository } from './modules/channels/channel-connections.repository.js';
import { InstagramProvider } from './infrastructure/channels/instagram.provider.js';
import { JwtOAuthStateService } from './infrastructure/channels/jwt-oauth-state.service.js';
import { AesTokenCipher } from './infrastructure/security/aes-token-cipher.js';
import { ChannelsService } from './modules/channels/channels.service.js';
import { ChannelsController } from './modules/channels/channels.controller.js';
import { createChannelsRouter } from './modules/channels/channels.routes.js';
import { PrismaContactsRepository } from './modules/messaging/contacts.repository.js';
import { PrismaConversationsRepository } from './modules/messaging/conversations.repository.js';
import { PrismaMessagesRepository } from './modules/messaging/messages.repository.js';
import { MessageIngestionService } from './modules/messaging/message-ingestion.service.js';
import { MessagingQueryService } from './modules/messaging/messaging-query.service.js';
import { MessagingController } from './modules/messaging/messaging.controller.js';
import { createContactsRouter } from './modules/messaging/contacts.routes.js';
import { createConversationsRouter } from './modules/messaging/conversations.routes.js';
import type { ChannelWebhookEvent } from './application/interfaces/channel-provider.interface.js';
import { AiProviderRegistry } from './modules/ai/ai-provider.registry.js';
import { OpenAiProvider } from './infrastructure/ai/openai.provider.js';
import { ClaudeProvider } from './infrastructure/ai/claude.provider.js';
import { GeminiProvider } from './infrastructure/ai/gemini.provider.js';
import { FlowsService } from './modules/flows/flows.service.js';
import { FlowsController } from './modules/flows/flows.controller.js';
import { createFlowsRouter } from './modules/flows/flows.routes.js';
import { RedisCache } from './infrastructure/queue/redis-cache.js';
import { BullMqJobQueue } from './infrastructure/queue/bullmq-job-queue.js';
import { PrismaBillingRepository } from './modules/billing/billing.repository.js';
import { BillingController, createBillingRouter } from './modules/billing/billing.controller.js';
import { PrismaNotificationsRepository } from './modules/notifications/notifications.repository.js';
import {
  NotificationsController,
  createNotificationsRouter,
} from './modules/notifications/notifications.controller.js';
import { AnalyticsController, createAnalyticsRouter } from './modules/analytics/analytics.controller.js';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace -- standard way to augment Express's Request type (see request-id.middleware.ts)
  namespace Express {
    interface Request {
      /** Raw request body bytes, captured by express.json's `verify` hook below — needed to verify webhook HMAC signatures (Milestone 8), which operate on the exact bytes sent, not the re-serialized JSON. */
      rawBody?: Buffer;
    }
  }
}

const app = express();

// Assigns a requestId to EVERY request, including ones rejected by the
// security layer below — so even a CORS/helmet/rate-limit rejection is
// traceable in the logs and in its error response.
app.use(requestIdMiddleware);

// --- Security layer (Milestone 6) ---
app.use(securityHeadersMiddleware);
app.use(corsMiddleware);

/**
 * Application health check. Confirms the process itself is up and
 * responding — no external dependencies checked here. Used by uptime
 * checks and, later, container liveness probes (Milestone 14).
 *
 * Registered BEFORE body parsing / rate limiting / CSRF checks so
 * orchestrator probes (which can fire every few seconds) never consume
 * rate-limit budget and are never blocked by a state-changing-request
 * check they don't need.
 */
app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    uptimeSeconds: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

/**
 * Readiness check. Confirms the application can actually serve traffic,
 * i.e. its database connection is alive. Kept separate from /health so
 * that container orchestration can distinguish "process is running" from
 * "process is ready to receive traffic" (Milestone 14: liveness vs
 * readiness probes rely on exactly this distinction).
 */
app.get('/health/database', async (_req: Request, res: Response) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.status(200).json({
      status: 'ok',
      database: 'connected',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    logger.error('Database readiness check failed', { error });
    res.status(503).json({
      status: 'degraded',
      database: 'unreachable',
      timestamp: new Date().toISOString(),
    });
  }
});

app.use(
  express.json({
    verify: (req, _res, buf) => {
      (req as express.Request).rawBody = buf;
    },
  }),
);
app.use(sanitizeBodyMiddleware);
app.use(csrfProtectionMiddleware);
app.use(defaultRateLimiter);

/**
 * Composition root: this is the one place allowed to construct concrete
 * implementations (Prisma-backed repositories, Bcrypt, JWT) and wire them
 * into services via constructor injection — per
 * docs/dependency-injection-conventions.md. Every class above this point
 * only ever depends on abstractions.
 */
const usersRepository = new PrismaUsersRepository(prisma);
const usersService = new UsersService(usersRepository);
const refreshTokensRepository = new PrismaRefreshTokensRepository(prisma);
const tokenService = new JwtTokenService();
const passwordHasher = new BcryptPasswordHasher();
const authService = new AuthService(usersService, tokenService, passwordHasher, refreshTokensRepository, eventBus);
const authController = new AuthController(authService);
const authenticateMiddleware = createAuthenticateMiddleware(tokenService);

const channelProviderRegistry = new ChannelProviderRegistry();
channelProviderRegistry.register(new InstagramProvider());
const channelConnectionsRepository = new PrismaChannelConnectionsRepository(prisma);
const oauthStateService = new JwtOAuthStateService();
const tokenCipher = new AesTokenCipher();
const channelsService = new ChannelsService(
  channelProviderRegistry,
  channelConnectionsRepository,
  oauthStateService,
  tokenCipher,
  eventBus,
  logger,
);
const channelsController = new ChannelsController(channelsService);

const contactsRepository = new PrismaContactsRepository(prisma);
const conversationsRepository = new PrismaConversationsRepository(prisma);
const messagesRepository = new PrismaMessagesRepository(prisma);
const messageIngestionService = new MessageIngestionService(
  channelConnectionsRepository,
  contactsRepository,
  conversationsRepository,
  messagesRepository,
  logger,
);
const messagingQueryService = new MessagingQueryService(
  contactsRepository,
  conversationsRepository,
  messagesRepository,
);
const messagingController = new MessagingController(messagingQueryService);

const aiProviderRegistry = new AiProviderRegistry();
aiProviderRegistry.register(new OpenAiProvider());
aiProviderRegistry.register(new ClaudeProvider());
aiProviderRegistry.register(new GeminiProvider());
const flowsService = new FlowsService(aiProviderRegistry, conversationsRepository, messagesRepository);
const flowsController = new FlowsController(flowsService, conversationsRepository);

// Milestone 11: Redis-backed cache and job queue, ready for future
// modules to use — not yet wired into any existing synchronous path.
const cache = new RedisCache();
const jobQueue = new BullMqJobQueue(logger);
void cache;
void jobQueue;

const billingController = new BillingController(new PrismaBillingRepository(prisma));
const notificationsController = new NotificationsController(new PrismaNotificationsRepository(prisma));
const analyticsController = new AnalyticsController(contactsRepository, conversationsRepository);

// Milestone 9's entire connection to Milestone 8: subscribe to the event
// ChannelsService already publishes. ChannelsService has zero knowledge
// this subscriber exists — that decoupling is the reason the Event Bus
// exists at all (Milestone 4).
eventBus.subscribe<ChannelWebhookEvent>('channel.webhook.received', (event) => {
  messageIngestionService.handleChannelWebhookEvent(event).catch((error: unknown) => {
    logger.error('Message ingestion failed for a webhook event', {
      provider: event.provider,
      error,
    });
  });
});

// Business endpoints are versioned per docs/api-versioning-policy.md.
// Health checks intentionally stay unversioned (see routes above).
// `authRateLimiter` layers a much stricter ceiling on top of the global
// `defaultRateLimiter` already applied above — login/registration are the
// classic brute-force target.
app.use('/api/v1/auth', authRateLimiter, createAuthRouter(authController));
app.use('/api/v1/channels', createChannelsRouter(channelsController, authenticateMiddleware));
app.use('/api/v1/contacts', createContactsRouter(messagingController, authenticateMiddleware));
app.use(
  '/api/v1/conversations',
  createConversationsRouter(messagingController, authenticateMiddleware),
);
app.use('/api/v1/conversations', createFlowsRouter(flowsController, authenticateMiddleware));
app.use('/api/v1/billing', createBillingRouter(billingController, authenticateMiddleware));
app.use(
  '/api/v1/notifications',
  createNotificationsRouter(notificationsController, authenticateMiddleware),
);
app.use('/api/v1/analytics', createAnalyticsRouter(analyticsController, authenticateMiddleware));

// Must come after every real route: turns any unmatched request into a
// uniform NotFoundError instead of Express's default HTML 404 page.
app.use(notFoundMiddleware);

// Must be the LAST app.use call — Express identifies error middleware by
// its 4-argument signature.
app.use(errorHandlerMiddleware);

const server = app.listen(appConfig.port, () => {
  logger.info(`API server listening on port ${appConfig.port}`, {
    nodeEnv: appConfig.nodeEnv,
  });
});

/**
 * Graceful shutdown: stops accepting new connections and waits for
 * in-flight requests to finish before exiting the process. Required
 * for zero-downtime deploys and clean container restarts (Milestone 14).
 */
function shutdown(signal: NodeJS.Signals): void {
  logger.info(`${signal} received: closing server gracefully...`);

  server.close((err) => {
    if (err) {
      logger.error('Error while closing server', { error: err });
      process.exit(1);
    }

    prisma.$disconnect().finally(() => {
      logger.info('Server and database connection closed. Process exiting.');
      process.exit(0);
    });
  });

  // Safety net: force-exit if connections don't close in time.
  setTimeout(() => {
    logger.error('Forcing shutdown after timeout.');
    process.exit(1);
  }, appConfig.shutdownTimeoutMs).unref();
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
