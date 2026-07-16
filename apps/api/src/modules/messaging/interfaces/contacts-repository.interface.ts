export interface ContactRecord {
  id: string;
  userId: string;
  provider: string;
  externalContactId: string;
  displayName: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface UpsertContactData {
  userId: string;
  provider: string;
  externalContactId: string;
  displayName?: string | null;
}

export interface ContactsRepository {
  /** Creates the contact, or returns the existing one for the same (userId, provider, externalContactId) — a returning contact never creates a duplicate row. */
  upsertByExternalId(data: UpsertContactData): Promise<ContactRecord>;
  findById(id: string): Promise<ContactRecord | null>;
  listByUser(userId: string): Promise<ContactRecord[]>;
}
