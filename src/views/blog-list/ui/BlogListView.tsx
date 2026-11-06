import { PostRow } from '@/entities/post';
import { getPublishedPosts } from '@/server/lib/content/posts';
import { PageIntro } from '@/shared/ui';

export const BLOG_LEDE =
  'Notes from deploying AI with real teams, the things I build, and whatever I learned this week.';

export async function BlogListView() {
  const posts = await getPublishedPosts();
  return (
    <>
      <PageIntro title="Writing" lede={BLOG_LEDE} />
      {posts.map((post) => (
        <PostRow key={post.id} post={post} />
      ))}
    </>
  );
}
