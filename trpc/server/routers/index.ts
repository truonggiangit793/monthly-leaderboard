import { t } from '../index';

import { publicRouter } from './public';

export const appRouter = t.router({
  public: publicRouter,
});

export type AppRouter = typeof appRouter;
