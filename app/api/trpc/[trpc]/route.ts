import { createTRPCContext } from '@/trpc/server/context';
import { appRouter } from '@/trpc/server/routers';
import { fetchRequestHandler } from '@trpc/server/adapters/fetch';

const handler = (request: Request) =>
  fetchRequestHandler({
    endpoint: '/api/trpc',
    req: request,
    router: appRouter,
    createContext: createTRPCContext,
  });

export { handler as GET, handler as POST };
