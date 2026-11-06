'use client';

import { useState, type FormEvent } from 'react';
import { NOTE_BODY_MAX, NOTE_NAME_MAX, TOPICS, isSubmitTimeout, useSubmitNote, type Topic } from '@/entities/note';

export interface SubmittedNote {
  status: 'approved' | 'pending';
  noteId: string;
  name: string;
  topic: Topic;
  body: string;
}

interface NoteFormProps {
  onSubmitted: (note: SubmittedNote) => void;
}

type StatusKind = 'ok' | 'pending' | 'error';

const PENDING_TEXT = 'thanks — your note is being reviewed before it appears.';
const FAILED_TEXT = 'something went wrong. try again.';
const TIMEOUT_TEXT = 'that took too long. try again.';

export function NoteForm({ onSubmitted }: NoteFormProps) {
  const [name, setName] = useState('');
  const [topic, setTopic] = useState<Topic>('feedback');
  const [body, setBody] = useState('');
  const [status, setStatus] = useState<{ kind: StatusKind; text: string } | null>(null);

  const submit = useSubmitNote({
    onSuccess(data) {
      if (data.status === 'approved') {
        setStatus({ kind: 'ok', text: 'your note is up.' });
        onSubmitted({ status: 'approved', noteId: data.noteId, name, topic, body });
      } else {
        setStatus({ kind: 'pending', text: PENDING_TEXT });
      }
      setBody('');
    },
    onError(error) {
      setStatus({ kind: 'error', text: isSubmitTimeout(error) ? TIMEOUT_TEXT : error.message || FAILED_TEXT });
    },
  });

  const over = body.length > NOTE_BODY_MAX;
  const canSubmit = body.trim().length > 0 && !over && !submit.isPending;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSubmit) return;
    setStatus(null);
    submit.mutate({ name, topic, body });
  }

  return (
    <form className="wall-form" onSubmit={handleSubmit} noValidate>
      <div className="wall-form__row">
        <label className="wall-form__field">
          <span className="wall-form__label">name (optional)</span>
          <input
            type="text"
            value={name}
            maxLength={NOTE_NAME_MAX}
            placeholder="anon"
            autoComplete="off"
            onChange={(e) => setName(e.currentTarget.value)}
          />
        </label>
        <label className="wall-form__field" style={{ flex: '0 0 140px' }}>
          <span className="wall-form__label">topic</span>
          <select value={topic} onChange={(e) => setTopic(e.currentTarget.value as Topic)}>
            {TOPICS.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="wall-form__field" style={{ marginBottom: '12px' }}>
        <span className="wall-form__label">your note</span>
        <textarea
          value={body}
          placeholder="tell me something. ask anything. propose a collab."
          onChange={(e) => setBody(e.currentTarget.value)}
        />
      </div>

      <div className="wall-form__foot">
        <span className="wall-form__count" data-over={over}>
          {body.length}/{NOTE_BODY_MAX}
        </span>
        <button className="wall-btn" type="submit" disabled={!canSubmit}>
          {submit.isPending ? 'sending…' : 'pin it up'}
        </button>
      </div>

      {status && (
        <div className="wall-status" data-kind={status.kind} role="status">
          {status.text}
        </div>
      )}

      <p className="wall-privacy">submissions are stored and reviewed before appearing publicly.</p>
    </form>
  );
}
