/**
 * Public-facing user shape — safe to return from any API response.
 * Never includes `passwordHash` or any other sensitive field.
 */
export interface PublicUser {
  id: string;
  email: string;
  fullName: string;
  createdAt: Date;
}
