import 'server-only';
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import matter from 'gray-matter';
import type { z } from 'zod';

export interface ContentEntry<T> {
  /** filename without extension, used as the slug */
  id: string;
  data: T;
  /** raw MDX body, frontmatter stripped */
  body: string;
}

const CONTENT_ROOT = path.join(process.cwd(), 'content');
const MDX = /\.mdx?$/;

/** Reads every .md/.mdx file in content/<dir>, validating frontmatter against the schema. */
export async function loadCollection<S extends z.ZodTypeAny>(
  dir: string,
  schema: S,
): Promise<ContentEntry<z.output<S>>[]> {
  const base = path.join(CONTENT_ROOT, dir);
  const files = (await readdir(base)).filter((file) => MDX.test(file));
  return Promise.all(
    files.map(async (file) => {
      const raw = await readFile(path.join(base, file), 'utf8');
      const { data, content } = matter(raw);
      const parsed = schema.safeParse(data);
      if (!parsed.success) {
        throw new Error(`Invalid frontmatter in content/${dir}/${file}: ${parsed.error.message}`);
      }
      return { id: file.replace(MDX, ''), data: parsed.data, body: content };
    }),
  );
}
