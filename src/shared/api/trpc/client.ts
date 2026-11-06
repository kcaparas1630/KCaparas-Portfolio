'use client';

import { createTRPCContext } from '@trpc/tanstack-react-query';
// Type-only import: the router type is assembled in the app layer, but the
// typed hooks have to be reachable from every slice. Erased at build time, so
// there is no runtime dependency on the app layer.
import type { AppRouter } from '@/server/router';

export const { TRPCProvider, useTRPC, useTRPCClient } = createTRPCContext<AppRouter>();
