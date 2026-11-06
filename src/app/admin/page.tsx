import { pageMetadata } from '@/shared/lib/page-metadata';
import { AdminLoginView } from '@/views/admin-login';

export const metadata = pageMetadata({
  path: '/admin',
  title: 'admin — kent caparas',
  description: 'restricted area.',
});

export default function Page() {
  return <AdminLoginView />;
}
