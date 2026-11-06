import 'server-only';
import { initTRPC, TRPCError } from '@trpc/server';
import superjson from 'superjson';
import { ZodError } from 'zod';
import type { Context } from './context';

const t = initTRPC.context<Context>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    // the first zod issue is written for humans, the default message is raw JSON
    if (error.cause instanceof ZodError) {
      return { ...shape, message: error.cause.issues[0]?.message ?? 'Invalid input.' };
    }
    // unexpected throws can carry env var names and upstream details
    if (error.code === 'INTERNAL_SERVER_ERROR') {
      return { ...shape, message: 'Something went wrong.' };
    }
    return shape;
  },
});

export const router = t.router;
export const publicProcedure = t.procedure;

// Session-cookie gate for the dashboard procedures.
export const adminProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.isAdmin) throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Unauthorized.' });
  return next({ ctx });
});
