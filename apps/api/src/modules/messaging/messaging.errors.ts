import { AppError } from '../../application/errors/app-error.js';

export class ConversationNotFoundError extends AppError {
  readonly code = 'CONVERSATION_NOT_FOUND';
  readonly statusCode = 404;
}
