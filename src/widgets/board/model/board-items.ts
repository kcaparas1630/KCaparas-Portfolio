import type { BoardItem } from './board-item';

const EMAIL = 'kentcaparas12@gmail.com';
const GITHUB = 'https://github.com/kent-caparas';

/** Lines from the hello world post, trimmed. */
export const ABOUT_NOTES: BoardItem[] = [
  {
    id: 'about-use-cases',
    kind: 'about',
    word: 'use cases',
    label: 'kent',
    meta: 'about',
    pinned: true,
    body: 'i love building things. use cases excite me.',
  },
  {
    id: 'about-shy',
    kind: 'about',
    word: 'shy',
    label: 'kent',
    meta: 'about',
    pinned: true,
    body: 'someone who could be unhinged, and at the same time exceptionally shy.',
  },
  {
    id: 'about-desk',
    kind: 'about',
    word: 'desk',
    label: 'kent',
    meta: 'about',
    pinned: true,
    body: "touching grass helps. it doesn't keep me away from my desk.",
  },
];

export const LINK_NOTES: BoardItem[] = [
  {
    id: 'link-github',
    kind: 'link',
    word: 'github',
    label: 'github',
    meta: 'link',
    pinned: true,
    body: 'kent-caparas',
    href: GITHUB,
  },
  {
    id: 'link-email',
    kind: 'link',
    word: 'email',
    label: 'email',
    meta: 'link',
    pinned: true,
    body: EMAIL,
    href: `mailto:${EMAIL}`,
  },
  {
    id: 'invite',
    kind: 'invite',
    word: 'say hi',
    label: '+ leave a note',
    body: 'ask anything, or share something you learned.',
    href: '/wall',
  },
];
