'use client';

import { useMutation } from '@tanstack/react-query';
import { useTRPCClient } from '@/shared/api';
import type { SubmissionInput } from '../model/schema';

const SUBMIT_TIMEOUT_MS = 8000;

interface SubmitResult {
  status: 'approved' | 'pending';
  noteId: string;
}

interface Options {
  onSuccess: (result: SubmitResult) => void;
  onError: (error: Error) => void;
}

export function isSubmitTimeout(error: Error): boolean {
  const name = error.cause instanceof Error ? error.cause.name : error.name;
  return name === 'TimeoutError' || name === 'AbortError';
}

/** Sends a note to the server, which runs moderation before it is stored. */
export function useSubmitNote({ onSuccess, onError }: Options) {
  const client = useTRPCClient();
  return useMutation({
    mutationFn: (input: SubmissionInput) =>
      client.wall.submit.mutate(input, { signal: AbortSignal.timeout(SUBMIT_TIMEOUT_MS) }),
    onSuccess,
    onError,
  });
}
