import { describe, it, expect } from 'vitest';
import { ValidationError, NotFoundError } from '../application/errors/common-errors.js';

describe('common errors', () => {
  it('sets code/statusCode', () => {
    const err = new ValidationError('bad input', { field: 'email' });
    expect(err.code).toBe('VALIDATION_ERROR');
    expect(err.statusCode).toBe(400);
    expect(err.details).toEqual({ field: 'email' });
  });

  it('omits details when not provided', () => {
    const err = new NotFoundError('missing');
    expect(err.details).toBeUndefined();
    expect(err.statusCode).toBe(404);
  });
});
