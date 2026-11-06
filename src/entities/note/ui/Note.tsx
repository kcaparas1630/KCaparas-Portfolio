import type { PointerEvent } from 'react';
import { relativeTime } from '@/shared/lib/relative-time';
import type { PublicNote } from '../model/types';

export interface NotePosition {
  x: number;
  y: number;
  rotate: number;
  zIndex: number;
}

interface NoteProps {
  note: PublicNote;
  position: NotePosition;
  dragging: boolean;
  onPointerDown: (event: PointerEvent<HTMLDivElement>, id: string) => void;
}

export function Note({ note, position, dragging, onPointerDown }: NoteProps) {
  const style = {
    left: `${position.x}px`,
    top: `${position.y}px`,
    transform: `rotate(${position.rotate}deg)`,
    zIndex: position.zIndex,
  };
  const className = dragging ? 'wall-note is-dragging' : 'wall-note';

  return (
    <div
      className={className}
      data-topic={note.topic}
      style={style}
      onPointerDown={(event) => onPointerDown(event, note.id)}
    >
      <div className="wall-note__head">
        <span className="wall-note__name">{note.name || 'anon'}</span>
        <span className="wall-note__topic">{note.topic}</span>
      </div>
      <p className="wall-note__body">{note.body}</p>
      <time className="wall-note__time" dateTime={note.createdAt}>
        {relativeTime(note.createdAt)}
      </time>
    </div>
  );
}
