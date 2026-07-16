import { AppError } from '../../application/errors/app-error.js';

export class UnknownChannelProviderError extends AppError {
  readonly code = 'CHANNEL_UNKNOWN_PROVIDER';
  readonly statusCode = 404;
}

export class InvalidOAuthStateError extends AppError {
  readonly code = 'CHANNEL_INVALID_OAUTH_STATE';
  readonly statusCode = 400;
}

export class ChannelConnectionFailedError extends AppError {
  readonly code = 'CHANNEL_CONNECTION_FAILED';
  readonly statusCode = 502;
}

export class ChannelAlreadyConnectedError extends AppError {
  readonly code = 'CHANNEL_ALREADY_CONNECTED';
  readonly statusCode = 409;
}

export class InvalidWebhookRequestError extends AppError {
  readonly code = 'CHANNEL_INVALID_WEBHOOK_REQUEST';
  readonly statusCode = 403;
}
