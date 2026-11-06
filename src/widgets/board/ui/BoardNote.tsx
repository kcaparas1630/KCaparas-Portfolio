'use client';

import type { MouseEvent, PointerEvent, ReactNode, Ref } from 'react';
import { relativeTime } from '@/shared/lib/relative-time';
import { NotePin } from '@/entities/note';
import type { BoardItem, BoardKind } from '../model/board-item';

interface Props {
  item: BoardItem;
  noteRef: Ref<HTMLElement>;
  onPointerDown: (event: PointerEvent<HTMLElement>) => void;
  onClick: (event: MouseEvent<HTMLElement>) => void;
}

interface BodyProps {
  item: BoardItem;
}

// reuses the wall's paper colors
const TOPIC: Record<BoardKind, string> = {
  photo: 'photo',
  about: 'hello',
  post: 'idea',
  project: 'feedback',
  link: 'collab',
  invite: 'invite',
  visitor: 'hello',
};

function Head({ item }: BodyProps) {
  return (
    <div className="wall-note__head">
      <span className="wall-note__name">{item.label}</span>
      {item.meta && <span className="wall-note__topic">{item.meta}</span>}
    </div>
  );
}

function PhotoBody({ item }: BodyProps) {
  if (!item.image) return null;
  return (
    <>
      <img src={item.image.src} srcSet={item.image.srcset} sizes="240px" alt={item.image.alt} draggable={false} />
      <span className="board-note__caption">{item.label}</span>
    </>
  );
}

// addresses wrap at the @ on narrow notes instead of mid word
function breakAtSign(text = ''): ReactNode {
  const at = text.indexOf('@');
  if (at < 0) return text;
  return (
    <>
      {text.slice(0, at)}
      <wbr />
      {text.slice(at)}
    </>
  );
}

function TextBody({ item }: BodyProps) {
  return (
    <>
      <Head item={item} />
      <p className="wall-note__body">{breakAtSign(item.body)}</p>
      {item.createdAt && (
        <time className="wall-note__time" dateTime={item.createdAt}>
          {relativeTime(item.createdAt)}
        </time>
      )}
    </>
  );
}

function EntryBody({ item }: BodyProps) {
  return (
    <>
      <Head item={item} />
      <p className="board-note__title">{item.title}</p>
      {item.body && <p className="wall-note__body">{breakAtSign(item.body)}</p>}
    </>
  );
}

function InviteBody({ item }: BodyProps) {
  return (
    <>
      <span className="wall-note--new__label">{item.label}</span>
      <span className="wall-note--new__hint">{item.body}</span>
    </>
  );
}

const BODIES: Record<BoardKind, (props: BodyProps) => ReactNode> = {
  photo: PhotoBody,
  about: TextBody,
  link: TextBody,
  visitor: TextBody,
  post: EntryBody,
  project: EntryBody,
  invite: InviteBody,
};

// outside links open in a new tab
function linkAttrs(href: string): { target?: string; rel?: string } {
  if (href.startsWith('http')) return { target: '_blank', rel: 'noopener' };
  return {};
}

function noteClass(kind: BoardKind): string {
  if (kind === 'photo') return 'wall-note board-note board-note--photo';
  if (kind === 'invite') return 'wall-note wall-note--new board-note';
  return 'wall-note board-note';
}

export function BoardNote({ item, noteRef, onPointerDown, onClick }: Props) {
  const Body = BODIES[item.kind];
  const shared = {
    id: `note-${item.id}`,
    className: noteClass(item.kind),
    'data-topic': item.topic ?? TOPIC[item.kind],
    onPointerDown,
    onClick,
  };

  if (!item.href) {
    return (
      <div {...shared} ref={noteRef as Ref<HTMLDivElement>}>
        {item.pinned && <NotePin />}
        <Body item={item} />
      </div>
    );
  }

  return (
    <a {...shared} {...linkAttrs(item.href)} ref={noteRef as Ref<HTMLAnchorElement>} href={item.href} draggable={false}>
      {item.pinned && <NotePin />}
      <Body item={item} />
    </a>
  );
}
