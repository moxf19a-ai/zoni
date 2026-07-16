-- Milestone 8: Plugin System foundation — one table for ALL channel
-- providers (Instagram today; Facebook/WhatsApp/Telegram/TikTok/Email
-- later just add rows with a new `provider` value, no schema change).

-- CreateTable
CREATE TABLE "channel_connections" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "provider" TEXT NOT NULL,
    "external_account_id" TEXT NOT NULL,
    "access_token" TEXT NOT NULL,
    "token_expires_at" TIMESTAMP(3),
    "status" TEXT NOT NULL DEFAULT 'active',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "channel_connections_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "channel_connections_user_id_provider_key" ON "channel_connections"("user_id", "provider");

-- CreateIndex
CREATE INDEX "channel_connections_user_id_idx" ON "channel_connections"("user_id");

-- CreateIndex
CREATE INDEX "channel_connections_provider_idx" ON "channel_connections"("provider");

-- CreateIndex
CREATE INDEX "channel_connections_deleted_at_idx" ON "channel_connections"("deleted_at");

-- AddForeignKey
ALTER TABLE "channel_connections" ADD CONSTRAINT "channel_connections_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
