'use client';

import { useQuery } from '@tanstack/react-query';
import { useTRPC } from '@/shared/api';

/** Approved notes for client-side refresh (home board, wall). */
export function useApprovedNotes(limit: number) {
  const trpc = useTRPC();
  return useQuery(trpc.wall.list.queryOptions({ limit }, { retry: false }));
}
