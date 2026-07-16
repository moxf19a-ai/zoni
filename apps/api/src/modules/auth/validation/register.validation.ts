import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().email('A valid email address is required.'),
  password: z.string().min(8, 'Password must be at least 8 characters long.'),
  fullName: z.string().min(1, 'Full name is required.'),
});
