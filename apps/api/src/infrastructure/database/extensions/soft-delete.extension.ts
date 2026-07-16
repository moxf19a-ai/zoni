import { Prisma } from '@prisma/client';

/**
 * Generic soft-delete extension for Prisma Client.
 */

const softDeletableModels = new Set<string>(['User']);

const READ_OPERATIONS_TO_SCOPE = [
  'findMany',
  'findFirst',
  'findFirstOrThrow',
  'count',
] as const;

function uncapitalize(value: string): string {
  return value.charAt(0).toLowerCase() + value.slice(1);
}

export const softDeleteExtension = Prisma.defineExtension((client) =>
  client.$extends({
    name: 'soft-delete',
    query: {
      $allModels: {
        async $allOperations({ model, operation, args, query }) {
          if (!model || !softDeletableModels.has(model)) {
            return query(args);
          }

          const delegate = (client as unknown as Record<string, any>)[
            uncapitalize(model)
          ];

          if (operation === 'delete') {
            return delegate.update({
              where: (args as any).where,
              data: { deletedAt: new Date() },
            });
          }

          if (operation === 'deleteMany') {
            return delegate.updateMany({
              where: (args as any).where,
              data: { deletedAt: new Date() },
            });
          }

          if (READ_OPERATIONS_TO_SCOPE.includes(operation as any)) {
            const whereArgs = args as { where?: Record<string, unknown> };

            whereArgs.where = {
              deletedAt: null,
              ...(whereArgs.where ?? {}),
            };
          }

          return query(args);
        },
      },
    },
  }),
);