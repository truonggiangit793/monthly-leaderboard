import { z } from 'zod';

export const pagingSchema = z.object({
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(10).default(10),
});

export type Paging = z.infer<typeof pagingSchema>;
