import { ADMIN_PATH } from '@/shared/lib/admin-routes';
import { pageMetadata } from '@/shared/lib/page-metadata';
import { AdminLoginView } from '@/views/admin-login';

export const metadata = {
  ...pageMetadata({ path: ADMIN_PATH, title: 'admin — kent caparas', description: 'restricted area.' }),
  robots: { index: false, follow: false },
};

export default function Page() {
  return <AdminLoginView />;
}
