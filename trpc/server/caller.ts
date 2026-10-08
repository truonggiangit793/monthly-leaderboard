import { createTRPCContext } from './context';
import { appRouter } from './routers';

export async function createServerCaller() {
  return appRouter.createCaller(await createTRPCContext());
}
