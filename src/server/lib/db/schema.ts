// No `server-only` here: drizzle-kit loads this file outside Next.
import { jsonb, pgEnum, pgTable, text, timestamp, uniqueIndex, uuid, varchar } from 'drizzle-orm/pg-core';
import { NOTE_BODY_MAX, NOTE_NAME_MAX } from '@/entities/note/model/schema';
import { TOPICS } from '@/entities/note/model/types';
import type { PostTag } from '@/entities/post/model/schema';
import type { ProjectStatus } from '@/entities/project/model/schema';

export const contentCategory = pgEnum('content_category', ['blog', 'project']);
export const contentStatus = pgEnum('content_status', ['draft', 'published']);
export const topicCategory = pgEnum('topic_category', TOPICS);
export const noteStatus = pgEnum('note_status', ['pending', 'accepted', 'rejected']);

export interface BlogMeta {
  tag: PostTag;
  readingTime?: number;
}

export interface ProjectMeta {
  status: ProjectStatus;
  tags: string[];
  repo?: string;
  demo?: string;
}

// RLS with no policies: the server connects as the table owner and is
// unaffected, while Supabase's public Data API can't read or write these.
export const content = pgTable(
  'content',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    slug: text('slug').notNull(),
    category: contentCategory('category').notNull(),
    title: text('title').notNull(),
    excerpt: text('excerpt').notNull(),
    status: contentStatus('status').notNull().default('draft'),
    publishedAt: timestamp('published_at', { withTimezone: true }),
    // content/<category>/<id>/<revision>.mdx
    s3Key: text('s3_key').notNull(),
    meta: jsonb('meta').$type<BlogMeta | ProjectMeta>().notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [uniqueIndex('content_category_slug_unique').on(table.category, table.slug)],
).enableRLS();

export const notes = pgTable('notes', {
  id: uuid('id').primaryKey().defaultRandom(),
  submitter: varchar('submitter', { length: NOTE_NAME_MAX }).notNull(),
  topic: topicCategory('topic').notNull(),
  content: varchar('content', { length: NOTE_BODY_MAX }).notNull(),
  status: noteStatus('status').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
}).enableRLS();

export type Content = typeof content.$inferSelect;
export type NewContent = typeof content.$inferInsert;
export type NoteRow = typeof notes.$inferSelect;
export type NewNoteRow = typeof notes.$inferInsert;
