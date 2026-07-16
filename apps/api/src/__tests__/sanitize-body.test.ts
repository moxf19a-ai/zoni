import { describe, it, expect } from 'vitest';

describe('sanitizeBodyMiddleware', () => {
  it('trims strings and strips control chars, recursively', async () => {
    const { sanitizeBodyMiddleware } = await import(
      '../presentation/http/middlewares/security/sanitize-body.middleware.js'
    );

    const req = { body: { name: '  Mohamed \x00 ', nested: { a: '  x\x1F ' }, list: ['  y '] } } as never;
    let called = false;
    sanitizeBodyMiddleware(req, {} as never, () => {
      called = true;
    });

    expect(called).toBe(true);
    expect((req as { body: { name: string } }).body.name).toBe('Mohamed');
    expect((req as { body: { nested: { a: string } } }).body.nested.a).toBe('x');
    expect((req as { body: { list: string[] } }).body.list[0]).toBe('y');
  });
});
