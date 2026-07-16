import type { EventBus, EventHandler } from '../../application/interfaces/event-bus.interface.js';
import type { Logger } from '../../application/interfaces/logger.interface.js';

/**
 * In-process, in-memory Event Bus implementation.
 *
 * Sufficient for a single-process deployment. If the platform ever needs
 * cross-process events (multiple API instances, background workers), this
 * file is the only one that changes — swap it for a Redis-backed
 * implementation of the same `EventBus` interface (Milestone 11: Queue &
 * Cache). No consuming code would need to change.
 *
 * A handler that throws (sync or async) is caught and logged — one
 * failing subscriber must never crash the publisher or block other
 * subscribers.
 */
function createInMemoryEventBus(logger: Logger): EventBus {
  const handlersByEvent = new Map<string, Set<EventHandler>>();

  return {
    publish(eventName, payload) {
      const handlers = handlersByEvent.get(eventName);
      if (!handlers || handlers.size === 0) {
        return;
      }

      for (const handler of handlers) {
        try {
          const result = handler(payload);
          if (result instanceof Promise) {
            result.catch((error: unknown) => {
              logger.error(`Event handler failed for "${eventName}"`, { error });
            });
          }
        } catch (error) {
          logger.error(`Event handler failed for "${eventName}"`, { error });
        }
      }
    },

    subscribe(eventName, handler) {
      if (!handlersByEvent.has(eventName)) {
        handlersByEvent.set(eventName, new Set());
      }
      handlersByEvent.get(eventName)?.add(handler as EventHandler);
    },
  };
}

export { createInMemoryEventBus };
