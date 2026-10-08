import { pagingSchema } from '@/schemas/common';
import { t } from '../../index';
import { z } from 'zod';
import { Board } from '@/schemas/board';

export const boardsRouter = t.router({
  list: t.procedure.input(pagingSchema.extend({
    month: z.string()
  })).query(async ({ input }) => {
    const boardsData: Board[] = [
      {
        id: 1,
        month: "2024-08",
        users: []
      },
      {
        id: 2,
        month: "2024-09",
        users: []
      },
      {
        id: 3,
        month: "2024-10",
        users: []
      },
      {
        id: 4,
        month: "2024-11",
        users: []
      }
    ];

    const { page, limit, month } = input;

  })
});
