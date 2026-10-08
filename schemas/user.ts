import { z } from 'zod';

export const userSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.email(),
  avatarUrl: z.url().optional(),
});

export type User = z.infer<typeof userSchema>;
