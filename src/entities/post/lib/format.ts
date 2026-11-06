import type { Post, PostTag } from '../model/schema';

/** Format a date as the mono system timestamp: 2026.05.14 */
export function formatStamp(date: Date): string {
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, '0');
  const d = String(date.getUTCDate()).padStart(2, '0');
  return `${y}.${m}.${d}`;
}

/** Shared name so the row title morphs into the article heading. */
export function postTransitionName(post: Pick<Post, 'id'>): string {
  return `post-${post.id.replace(/[^a-z0-9-]/gi, '-')}`;
}

/** Human label for a tag enum value, e.g. "patch-notes" -> "patch notes". */
export function formatTag(tag: PostTag): string {
  return tag.replace(/-/g, ' ');
}

export function postHref(post: Pick<Post, 'id'>): string {
  return `/blog/${post.id}`;
}
