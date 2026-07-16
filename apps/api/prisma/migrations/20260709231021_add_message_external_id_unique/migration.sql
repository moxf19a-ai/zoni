-- Prevents duplicate messages from provider webhook redeliveries
-- (at-least-once delivery is Meta's documented guarantee, not
-- exactly-once). Postgres allows multiple NULLs in a unique column, so
-- messages without a provider-assigned id are unaffected.

-- CreateIndex
CREATE UNIQUE INDEX "messages_external_message_id_key" ON "messages"("external_message_id");
