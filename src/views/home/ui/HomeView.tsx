import { getImageProps } from 'next/image';
import { formatStamp, postHref } from '@/entities/post';
import { getRecentPosts } from '@/server/lib/content/posts';
import { projectHref, statusLabel, type Project } from '@/entities/project';
import { getJobs, getRecentProjects } from '@/server/lib/content/projects';
import { ABOUT_NOTES, Board, LINK_NOTES, type BoardItem } from '@/widgets/board';
import { Hero } from '@/widgets/hero';
import portrait from '../assets/portrait.jpg';
import styles from './home.module.css';

const PHOTO_ALT = 'Kent Caparas in a cream blazer, seated at a table';

function readingLabel(minutes: number | undefined): string | undefined {
  if (!minutes) return undefined;
  return `${minutes} min read`;
}

function photoNote(): BoardItem {
  const { props } = getImageProps({ src: portrait, alt: PHOTO_ALT, sizes: '240px' });
  return {
    id: 'photo',
    kind: 'photo',
    word: 'kent',
    label: "that's me.",
    image: { src: props.src, srcset: props.srcSet ?? '', alt: PHOTO_ALT },
  };
}

const projectNote = (project: Project): BoardItem => ({
  id: `project-${project.id}`,
  kind: 'project',
  word: project.data.name.toLowerCase(),
  label: 'work',
  meta: statusLabel(project.data.status),
  title: project.data.name,
  body: project.data.description,
  href: projectHref(project),
});

export async function HomeView() {
  // about, day job and links always stay, only writing and projects rotate
  const [jobs, projects, posts] = await Promise.all([getJobs(), getRecentProjects(3), getRecentPosts(3)]);

  const postNotes: BoardItem[] = posts.map((post) => ({
    id: `post-${post.id}`,
    kind: 'post',
    word: post.data.title.toLowerCase(),
    label: 'writing',
    meta: formatStamp(post.data.date),
    title: post.data.title,
    body: readingLabel(post.data.readingTime),
    href: postHref(post),
  }));

  const items: BoardItem[] = [
    photoNote(),
    ...ABOUT_NOTES,
    ...jobs.map((job) => ({ ...projectNote(job), pinned: true })),
    ...postNotes,
    ...projects.map(projectNote),
    ...LINK_NOTES,
  ];
  const looseWords = items.flatMap(({ id, word }) => (word ? [{ id, word }] : []));

  return (
    <>
      <Hero looseWords={looseWords} />
      <section className={styles.wallSection} id="wall">
        <Board items={items} />
      </section>
    </>
  );
}
