'use client';

import { useModerationActions, type ModerationQueue } from '@/entities/note';

interface Props {
  noteId: string;
  queue: ModerationQueue;
  onError?: (message: string) => void;
}

export function NoteActions({ noteId, queue, onError }: Props) {
  const { setStatus, remove } = useModerationActions();
  const busy =
    (setStatus.isPending && setStatus.variables?.id === noteId) ||
    (remove.isPending && remove.variables?.id === noteId);
  const fail = (err: { message: string }) => onError?.(err.message || 'Action failed.');

  const approve = () => setStatus.mutate({ id: noteId, status: 'approved' }, { onError: fail });
  const reject = () => setStatus.mutate({ id: noteId, status: 'rejected' }, { onError: fail });
  const del = () => remove.mutate({ id: noteId }, { onError: fail });

  return (
    <div className="admin-row__actions">
      {queue === 'pending' && (
        <>
          <button className="admin-act" type="button" disabled={busy} onClick={approve}>
            approve
          </button>
          <button className="admin-act" type="button" disabled={busy} onClick={reject}>
            reject
          </button>
        </>
      )}
      {queue === 'rejected' && (
        <button className="admin-act" type="button" disabled={busy} onClick={approve}>
          restore
        </button>
      )}
      <button className="admin-act admin-act--danger" type="button" disabled={busy} onClick={del}>
        delete
      </button>
    </div>
  );
}
