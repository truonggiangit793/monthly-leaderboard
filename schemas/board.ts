import { userSchema } from '@/schemas/user';
import { z } from 'zod';

export const boardSchema = z.object({
  id: z.number(),
  month: z.string(),
  users: z.array(z.object({
    user: userSchema,
    score: z.number(),
  })),
});

export type Board = z.infer<typeof boardSchema>;
