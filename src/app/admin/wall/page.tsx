import { pageMetadata } from '@/shared/lib/page-metadata';
import { AdminWallView } from '@/views/admin-wall';

export const metadata = pageMetadata({
  path: '/admin/wall',
  title: 'wall · admin — kent caparas',
  description: 'restricted area.',
});

export default function Page() {
  return <AdminWallView />;
}
