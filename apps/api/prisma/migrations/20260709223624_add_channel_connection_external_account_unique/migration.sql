-- Fix discovered during Milestone 9's ingestion pipeline verification:
-- without this constraint, two different platform users could both
-- "connect" the same external channel account (e.g. the same Instagram
-- Business Account), and an incoming webhook would resolve to whichever
-- connection a plain query happened to return first — silently
-- misattributing messages to the wrong user's inbox.

-- CreateIndex
CREATE UNIQUE INDEX "channel_connections_provider_external_account_id_key" ON "channel_connections"("provider", "external_account_id");
