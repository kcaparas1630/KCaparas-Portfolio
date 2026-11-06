import 'server-only';
import type { ReactNode } from 'react';
import { isProd } from '@/server/lib/env';
import { loadCollection } from './collection';
import { renderMdx } from './mdx';
import { PostFrontmatterSchema, type Post } from '@/entities/post/model/schema';

// Read boundary for posts. MDX files in content/posts today; a Drizzle table
// later, behind the same functions.

const isVisible = (post: Post): boolean => (isProd ? !post.data.draft : true);

/** All visible posts, newest first. Drafts are hidden in production builds. */
export async function getPublishedPosts(): Promise<Post[]> {
  const posts = await loadCollection('posts', PostFrontmatterSchema);
  return posts.filter(isVisible).sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

/** The N most recent posts for the home page log. */
export async function getRecentPosts(limit = 4): Promise<Post[]> {
  return (await getPublishedPosts()).slice(0, limit);
}

export async function getPostById(id: string): Promise<Post | null> {
  return (await getPublishedPosts()).find((post) => post.id === id) ?? null;
}

export function renderPost(post: Post): Promise<ReactNode> {
  return renderMdx(post.body);
}
