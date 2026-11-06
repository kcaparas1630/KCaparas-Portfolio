'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useTRPC } from '@/shared/api';
import type { ModerationQueue } from '../model/types';

export function useModerationQueue(queue: ModerationQueue) {
  const trpc = useTRPC();
  return useQuery(trpc.admin.list.queryOptions({ queue }, { retry: false }));
}

/** approve / reject / delete, then refetch whichever queue is on screen. */
export function useModerationActions() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const invalidate = () => queryClient.invalidateQueries({ queryKey: trpc.admin.list.pathKey() });

  const setStatus = useMutation(trpc.admin.setStatus.mutationOptions({ onSuccess: invalidate }));
  const remove = useMutation(trpc.admin.delete.mutationOptions({ onSuccess: invalidate }));

  return { setStatus, remove };
}
