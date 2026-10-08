import { usersRouter } from '@/trpc/server/routers/public/users';
import { t } from '../../index';
import { boardsRouter } from '@/trpc/server/routers/public/boards';

export const publicRouter = t.router({
  health: t.procedure.query(() => 'OK'),
  users: usersRouter,
  boards: boardsRouter,
});
