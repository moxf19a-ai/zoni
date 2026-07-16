import { PrismaClient } from '@prisma/client';
import { env } from '../../config/env.js';
import type { DatabaseClient } from '../../application/interfaces/database-client.type.js';
import { softDeleteExtension } from './extensions/soft-delete.extension.js';

/**
 * Single, shared Prisma Client instance for the whole API process.
 *
 * Why a singleton: creating a new PrismaClient per request exhausts the
 * database connection pool almost immediately under load. Every
 * repository/service in every future module must depend on the
 * `DatabaseClient` abstraction (see `application/interfaces/database-client.type.ts`)
 * — this file is the one sanctioned place allowed to construct the
 * concrete implementation and is only ever imported from the composition
 * root.
 *
 * The soft-delete extension is applied here so it's active for every
 * model that has a `deletedAt` field (starting with `User`, Milestone 5),
 * with zero per-repository wiring required. The extended client is cast
 * back to `DatabaseClient`: every repository only ever calls standard
 * model delegate methods (`findUnique`, `create`, `update`...), all of
 * which the extended client still provides in full.
 */
function createPrismaClient(): DatabaseClient {
  const basePrisma = new PrismaClient({
    log: env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
  });

  return basePrisma.$extends(softDeleteExtension) as unknown as DatabaseClient;
}

declare global {
  // eslint-disable-next-line no-var
  var __prisma: DatabaseClient | undefined;
}

/**
 * In development, `tsx watch` re-evaluates modules on every file change,
 * which would otherwise create a fresh PrismaClient (and a fresh connection
 * pool) on every reload. Caching it on `globalThis` avoids that. This has
 * no effect in production, where the process is created once.
 */
export const prisma = globalThis.__prisma ?? createPrismaClient();

if (env.NODE_ENV === 'development') {
  globalThis.__prisma = prisma;
}
