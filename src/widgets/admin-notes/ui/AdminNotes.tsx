'use client';

import { useState } from 'react';
import '@/shared/styles/wall.css';
import { LogoutButton } from '@/features/admin-auth';
import { useModerationQueue, type ModerationQueue } from '@/entities/note';
import { NoteActions } from '@/features/moderate-note';

const TABS: { key: ModerationQueue; label: string }[] = [
  { key: 'pending', label: 'pending' },
  { key: 'approved', label: 'approved' },
  { key: 'rejected', label: 'rejected' },
];

export function AdminNotes() {
  const [tab, setTab] = useState<ModerationQueue>('pending');
  const [actionError, setActionError] = useState('');
  const queue = useModerationQueue(tab);

  const notes = queue.data ?? [];
  const error = actionError || queue.error?.message || '';

  function switchTab(next: ModerationQueue) {
    setActionError('');
    setTab(next);
  }

  return (
    <div className="admin-wall">
      <div className="admin-bar">
        <div className="admin-tabs" role="tablist">
          {TABS.map((t) => (
            <button
              key={t.key}
              type="button"
              className={`admin-tab${tab === t.key ? ' is-active' : ''}`}
              role="tab"
              aria-selected={tab === t.key}
              onClick={() => switchTab(t.key)}
            >
              {t.label}
            </button>
          ))}
        </div>
        <LogoutButton />
      </div>

      {error && (
        <div className="wall-status" data-kind="error" role="status">
          {error}
        </div>
      )}

      {queue.isPending ? (
        <p className="admin-empty">loading…</p>
      ) : notes.length === 0 ? (
        <p className="admin-empty">nothing in {tab}.</p>
      ) : (
        <ul className="admin-list">
          {notes.map((note) => (
            <li className="admin-row" key={note.id}>
              <div className="admin-row__meta">
                <span className="admin-row__name">{note.name || 'anon'}</span>
                <span className="admin-row__topic">{note.topic}</span>
                <span className="admin-row__id">{note.id}</span>
              </div>
              <p className="admin-row__body">{note.body}</p>
              {note.reason && (
                <p className="admin-row__reason">
                  moderator: {note.reason}
                  {typeof note.confidence === 'number' ? ` (${note.confidence.toFixed(2)})` : ''}
                </p>
              )}
              <NoteActions noteId={note.id} queue={tab} onError={setActionError} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
