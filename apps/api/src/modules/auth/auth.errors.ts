import { AppError } from '../../application/errors/app-error.js';

export class EmailAlreadyInUseError extends AppError {
  readonly code = 'AUTH_EMAIL_ALREADY_IN_USE';
  readonly statusCode = 409;
}

export class InvalidCredentialsError extends AppError {
  readonly code = 'AUTH_INVALID_CREDENTIALS';
  readonly statusCode = 401;
}

export class InvalidRefreshTokenError extends AppError {
  readonly code = 'AUTH_INVALID_REFRESH_TOKEN';
  readonly statusCode = 401;
}
