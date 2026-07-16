/**
 * Event Bus abstraction (Application layer port).
 *
 * This is a skeleton: the mechanism exists so future modules can
 * communicate through events instead of direct imports of each other, but
 * NO domain events are defined or published yet — those belong to the
 * modules that will actually need them (e.g. a `ContactCreated` event
 * belongs to the Contacts module, not here).
 */
export type EventHandler<TPayload = unknown> = (payload: TPayload) => void | Promise<void>;

export interface EventBus {
  publish<TPayload = unknown>(eventName: string, payload: TPayload): void;
  subscribe<TPayload = unknown>(eventName: string, handler: EventHandler<TPayload>): void;
}
