import 'server-only';
import { eq } from 'drizzle-orm';
import type { ReactNode } from 'react';
import type { Post } from '@/entities/post/model/schema';
import { db } from '@/server/lib/db';
import { content, type BlogMeta, type Content } from '@/server/lib/db/schema';
import { isProd } from '@/server/lib/env';
import { getObjectText } from '@/server/lib/storage';
import { renderMdx } from './mdx';

function toPost(row: Content): Post {
  const meta = row.meta as BlogMeta;
  return {
    id: row.slug,
    s3Key: row.s3Key,
    data: {
      title: row.title,
      date: row.publishedAt ?? row.createdAt,
      tag: meta.tag,
      readingTime: meta.readingTime,
      excerpt: row.excerpt,
      draft: row.status === 'draft',
    },
  };
}

const isVisible = (post: Post): boolean => (isProd ? !post.data.draft : true);

/** All visible posts, newest first. Drafts are hidden in production builds. */
export async function getPublishedPosts(): Promise<Post[]> {
  const rows = await db.select().from(content).where(eq(content.category, 'blog'));
  return rows
    .map(toPost)
    .filter(isVisible)
    .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

/** The N most recent posts for the home page log. */
export async function getRecentPosts(limit = 4): Promise<Post[]> {
  return (await getPublishedPosts()).slice(0, limit);
}

export async function getPostById(id: string): Promise<Post | null> {
  return (await getPublishedPosts()).find((post) => post.id === id) ?? null;
}

export async function renderPost(post: Post): Promise<ReactNode> {
  return renderMdx(await getObjectText(post.s3Key));
}
