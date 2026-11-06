import { pageMetadata } from '@/shared/lib/page-metadata';
import { BLOG_LEDE, BlogListView } from '@/views/blog-list';

export const metadata = pageMetadata({ path: '/blog', title: 'Writing, Kent Caparas', description: BLOG_LEDE });

export default function Page() {
  return <BlogListView />;
}
