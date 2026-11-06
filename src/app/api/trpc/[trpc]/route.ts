import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { createContext } from '@/server/lib/context';
import { appRouter } from '@/server/router';

function handler(req: Request) {
  return fetchRequestHandler({
    endpoint: '/api/trpc',
    req,
    router: appRouter,
    createContext,
    onError({ path, error }) {
      if (error.code === 'INTERNAL_SERVER_ERROR') console.error(`[trpc] ${path}:`, error);
    },
  });
}

export { handler as GET, handler as POST };
