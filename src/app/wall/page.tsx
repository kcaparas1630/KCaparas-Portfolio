import { pageMetadata } from '@/shared/lib/page-metadata';
import { WallView } from '@/views/wall';

export const metadata = pageMetadata({
  path: '/wall',
  title: 'The wall, Kent Caparas',
  description:
    'A public sticky-note wall. Ask a question, share what you learned, or propose a collab. Every note is checked before it appears.',
});

// approved notes change as they are moderated, never cache this at build
export const dynamic = 'force-dynamic';

export default function Page() {
  return <WallView />;
}
