import { initTRPC } from '@trpc/server';

import type { WebTRPCContext } from './context';

export const t = initTRPC.context<WebTRPCContext>().create({
  errorFormatter({ shape }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        stack: undefined,
      },
    };
  },
});
