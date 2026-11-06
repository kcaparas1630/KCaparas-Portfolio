import type { PublicNote } from '@/entities/note';
import { getApprovedNotes } from '@/server/lib/notes/storage';
import { PageIntro } from '@/shared/ui';
import { Wall } from '@/widgets/sticky-wall';

export async function WallView() {
  let notes: PublicNote[] = [];
  try {
    notes = await getApprovedNotes({ limit: 100 });
  } catch (err) {
    console.error('[wall] failed to load approved notes:', err);
  }

  return (
    <>
      <PageIntro
        title="The wall"
        lede="Ask a question, share what you learned, or propose a collab. Every note is checked before it sticks."
      />
      <Wall initialNotes={notes} />
    </>
  );
}
