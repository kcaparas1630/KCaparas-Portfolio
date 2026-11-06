import 'server-only';
import { router } from '@/server/lib/trpc';
import { adminRouter } from './admin';
import { wallRouter } from './wall';

export const appRouter = router({
  wall: wallRouter,
  admin: adminRouter,
});

export type AppRouter = typeof appRouter;
