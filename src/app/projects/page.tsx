import { pageMetadata } from '@/shared/lib/page-metadata';
import { ProjectsListView, WORK_LEDE } from '@/views/projects-list';

export const metadata = pageMetadata({ path: '/projects', title: 'Work, Kent Caparas', description: WORK_LEDE });

export default function Page() {
  return <ProjectsListView />;
}
