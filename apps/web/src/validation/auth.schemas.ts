import { z } from 'zod';

/** Mirrors apps/api/src/modules/auth/validation/register.validation.ts */
export const registerFormSchema = z.object({
  email: z.string().email('A valid email address is required.'),
  password: z.string().min(8, 'Password must be at least 8 characters long.'),
  fullName: z.string().min(1, 'Full name is required.'),
});

/** Mirrors apps/api/src/modules/auth/validation/login.validation.ts */
export const loginFormSchema = z.object({
  email: z.string().email('A valid email address is required.'),
  password: z.string().min(1, 'Password is required.'),
});
