import type { Post } from '@/entities/post';
import { renderPost } from '@/server/lib/content/posts';
import { PostLayout } from '@/widgets/post-layout';

export async function BlogPostView({ post }: { post: Post }) {
  const content = await renderPost(post);
  return <PostLayout post={post}>{content}</PostLayout>;
}
