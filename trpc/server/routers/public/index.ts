import { t } from '../../index';

export const publicRouter = t.router({
  health: t.procedure.query(() => 'OK'),
});
