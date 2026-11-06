import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { pageMetadata } from '@/shared/lib/page-metadata';
import { getPostById, getPublishedPosts } from '@/server/lib/content/posts';
import { BlogPostView } from '@/views/blog-post';

interface Props {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = false;

export async function generateStaticParams() {
  const posts = await getPublishedPosts();
  return posts.map((post) => ({ slug: post.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostById(slug);
  if (!post) return {};
  return pageMetadata({
    path: `/blog/${post.id}`,
    title: `${post.data.title}, Kent Caparas`,
    description: post.data.excerpt,
  });
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const post = await getPostById(slug);
  if (!post) notFound();
  return <BlogPostView post={post} />;
}
