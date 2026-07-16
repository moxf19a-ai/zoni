import { createInMemoryEventBus } from './in-memory-event-bus.js';
import { logger } from '../logging/pino-logger.js';
import type { EventBus } from '../../application/interfaces/event-bus.interface.js';

/**
 * Shared Event Bus instance for the whole API process. Every future
 * module that needs to publish or subscribe to events imports `eventBus`
 * from here — never `createInMemoryEventBus` directly (that stays an
 * implementation detail).
 */
export const eventBus: EventBus = createInMemoryEventBus(logger);
