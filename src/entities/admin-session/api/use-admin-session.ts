'use client';

import { useMutation } from '@tanstack/react-query';
import { useTRPC } from '@/shared/api';

export function useAdminLogin(options: { onSuccess: () => void; onError: (error: { message: string }) => void }) {
  const trpc = useTRPC();
  return useMutation(trpc.admin.login.mutationOptions(options));
}

export function useAdminLogout(options: { onSettled: () => void }) {
  const trpc = useTRPC();
  return useMutation(trpc.admin.logout.mutationOptions(options));
}
