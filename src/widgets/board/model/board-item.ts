export type BoardKind = 'photo' | 'about' | 'post' | 'project' | 'link' | 'invite' | 'visitor';

export interface BoardImage {
  src: string;
  srcset: string;
  alt: string;
}

export interface BoardItem {
  id: string;
  kind: BoardKind;
  /** label on the globe. Items with a word fall from it. */
  word?: string;
  /** small label in the note head */
  label: string;
  /** small text on the right of the head */
  meta?: string;
  title?: string;
  body?: string;
  href?: string;
  image?: BoardImage;
  /** ISO date, visitor notes only */
  createdAt?: string;
  /** paper color, visitor notes only */
  topic?: string;
  /** always on the wall, gets a pushpin */
  pinned?: boolean;
}
