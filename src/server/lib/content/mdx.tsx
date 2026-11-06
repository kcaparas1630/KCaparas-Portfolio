import 'server-only';
import type { ReactNode } from 'react';
import { compileMDX } from 'next-mdx-remote/rsc';

/** Renders an MDX body (frontmatter already stripped) to React. */
export async function renderMdx(source: string): Promise<ReactNode> {
  const { content } = await compileMDX({ source });
  return content;
}
