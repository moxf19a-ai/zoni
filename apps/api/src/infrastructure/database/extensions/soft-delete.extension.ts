import { Prisma } from '@prisma/client';

/**
 * Generic soft-delete extension for Prisma Client.
 *
 * This was documented as "planned, not implemented" in
 * docs/database-conventions.md as of Milestone 3. Milestone 5 is the
 * first milestone to introduce a model with `deletedAt` (`User`), so this
 * is now built — exactly per that document's stated trigger condition.
 *
 * Pure infrastructure: contains no knowledge of any specific model. Any
 * model with a `deletedAt DateTime?` field automatically gets:
 *
 * - `delete` / `deleteMany` rewritten into `update` / `updateMany` that set
 *   `deletedAt: new Date()` instead of physically removing the row.
 * - `findMany`, `findFirst`, `findFirstOrThrow`, and `count` automatically
 *   scoped to `deletedAt: null`, unless the caller explicitly overrides
 *   `deletedAt` in its own `where` clause.
 *
 * Models without a `deletedAt` field (e.g. `RefreshToken`) are completely
 * unaffected — this extension is a no-op for them.
 *
 * Note: `findUnique`/`findUniqueOrThrow` are intentionally NOT scoped here
 * (Prisma does not allow adding extra `where` conditions to a unique
 * lookup). Every repository in this project uses `findFirst` instead of
 * `findUnique` for that reason — see modules/users/users.repository.ts.
 */

const softDeletableModels = new Set(
  Prisma.dmmf.datamodel.models
    .filter((model) => model.fields.some((field) => field.name === 'deletedAt'))
    .map((model) => model.name),
);

const READ_OPERATIONS_TO_SCOPE = ['findMany', 'findFirst', 'findFirstOrThrow', 'count'] as const;

function uncapitalize(value: string): string {
  return value.charAt(0).toLowerCase() + value.slice(1);
}

export const softDeleteExtension = Prisma.defineExtension((client) =>
  client.$extends({
    name: 'soft-delete',
    query: {
      $allModels: {
        async $allOperations({ model, operation, args, query }) {
          if (!softDeletableModels.has(model)) {
            return query(args);
          }

          const delegate = (client as unknown as Record<string, any>)[uncapitalize(model)];

          if (operation === 'delete') {
            return delegate.update({
              where: args.where,
              data: { deletedAt: new Date() },
            });
          }

          if (operation === 'deleteMany') {
            return delegate.updateMany({
              where: args.where,
              data: { deletedAt: new Date() },
            });
          }

          if ((READ_OPERATIONS_TO_SCOPE as readonly string[]).includes(operation)) {
            const whereArgs = args as { where?: Record<string, unknown> };
            whereArgs.where = { deletedAt: null, ...whereArgs.where };
          }

          return query(args);
        },
      },
    },
  }),
);
