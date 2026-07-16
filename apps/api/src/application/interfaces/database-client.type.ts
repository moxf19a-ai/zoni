import type { PrismaClient } from '@prisma/client';

/**
 * Abstraction boundary for the database client (Application layer port).
 *
 * Why this lives in `application/interfaces`, not `infrastructure`:
 * Infrastructure contains concrete implementations (Prisma, in this case).
 * The abstraction that Application-layer services/repositories depend on
 * must NOT live next to the implementation it abstracts — otherwise
 * depending on "the interface" is really still depending on the
 * infrastructure module that happens to export it, which defeats
 * Dependency Inversion. This file has zero Prisma-specific logic; it only
 * re-exposes Prisma's generated type as the project's persistence port.
 *
 * Today this is a direct alias of `PrismaClient` because Prisma IS the
 * concrete implementation. If the underlying client ever changed, only
 * this file and `infrastructure/database/prisma-client.ts` would need to
 * change — no repository or service importing `DatabaseClient` would be
 * affected.
 *
 * Convention for every future module:
 *   - Repositories accept `DatabaseClient` as a constructor parameter.
 *   - Only the composition root (currently `server.ts`; a factory module
 *     later) is allowed to import the concrete singleton from
 *     `infrastructure/database/prisma-client.ts` and pass it down.
 */
export type DatabaseClient = PrismaClient;
