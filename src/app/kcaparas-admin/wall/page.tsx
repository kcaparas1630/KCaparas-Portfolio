import { ADMIN_WALL_PATH } from '@/shared/lib/admin-routes';
import { pageMetadata } from '@/shared/lib/page-metadata';
import { AdminWallView } from '@/views/admin-wall';

export const metadata = {
  ...pageMetadata({ path: ADMIN_WALL_PATH, title: 'wall · admin — kent caparas', description: 'restricted area.' }),
  robots: { index: false, follow: false },
};

export default function Page() {
  return <AdminWallView />;
}
