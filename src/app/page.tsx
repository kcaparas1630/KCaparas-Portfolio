import { pageMetadata } from '@/shared/lib/page-metadata';
import { HomeView } from '@/views/home';

export const metadata = pageMetadata({ path: '/' });

export default function Page() {
  return <HomeView />;
}
