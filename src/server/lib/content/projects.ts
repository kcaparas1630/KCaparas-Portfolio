import 'server-only';
import { eq } from 'drizzle-orm';
import type { ReactNode } from 'react';
import { isJob } from '@/entities/project/lib/format';
import type { Project } from '@/entities/project/model/schema';
import { db } from '@/server/lib/db';
import { content, type Content, type ProjectMeta } from '@/server/lib/db/schema';
import { isProd } from '@/server/lib/env';
import { getObjectText } from '@/server/lib/storage';
import { renderMdx } from './mdx';

function toProject(row: Content): Project {
  const meta = row.meta as ProjectMeta;
  return {
    id: row.slug,
    s3Key: row.s3Key,
    data: {
      name: row.title,
      status: meta.status,
      description: row.excerpt,
      tags: meta.tags,
      repo: meta.repo,
      demo: meta.demo,
      date: row.publishedAt ?? undefined,
      draft: row.status === 'draft',
    },
  };
}

const isVisible = (project: Project): boolean => (isProd ? !project.data.draft : true);

const shippedAt = (project: Project): number => project.data.date?.getTime() ?? 0;

/** All visible projects, the day job first, then newest. Drafts are hidden in production builds. */
export async function getProjects(): Promise<Project[]> {
  const rows = await db.select().from(content).where(eq(content.category, 'project'));
  return rows
    .map(toProject)
    .filter(isVisible)
    .sort((a, b) => {
      if (isJob(a) !== isJob(b)) return isJob(a) ? -1 : 1;
      return shippedAt(b) - shippedAt(a);
    });
}

/** The day job, always pinned on the home wall. */
export async function getJobs(): Promise<Project[]> {
  return (await getProjects()).filter(isJob);
}

/** Newest side projects for the home wall, the day job excluded. */
export async function getRecentProjects(limit: number): Promise<Project[]> {
  return (await getProjects()).filter((p) => !isJob(p)).slice(0, limit);
}

export async function getProjectById(id: string): Promise<Project | null> {
  return (await getProjects()).find((project) => project.id === id) ?? null;
}

export async function renderProject(project: Project): Promise<ReactNode> {
  return renderMdx(await getObjectText(project.s3Key));
}
