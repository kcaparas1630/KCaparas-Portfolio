import { z } from 'zod';

export const PostTagSchema = z.enum(['postmortem', 'teardown', 'patch-notes', 'field-notes']);
export type PostTag = z.infer<typeof PostTagSchema>;

export const PostFrontmatterSchema = z.object({
  title: z.string(),
  date: z.coerce.date(),
  tag: PostTagSchema,
  readingTime: z.number().optional(),
  excerpt: z.string(),
  draft: z.boolean().default(false),
});

export type PostFrontmatter = z.output<typeof PostFrontmatterSchema>;

export interface Post {
  /** slug, the filename without extension (a row id once posts move to a table) */
  id: string;
  data: PostFrontmatter;
  /** raw MDX body */
  body: string;
}
