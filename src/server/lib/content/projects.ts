import 'server-only';
import type { ReactNode } from 'react';
import { isProd } from '@/server/lib/env';
import { loadCollection } from './collection';
import { renderMdx } from './mdx';
import { isJob } from '@/entities/project/lib/format';
import { ProjectFrontmatterSchema, type Project } from '@/entities/project/model/schema';

const isVisible = (project: Project): boolean => (isProd ? !project.data.draft : true);

const shippedAt = (project: Project): number => project.data.date?.getTime() ?? 0;

/** All visible projects, the day job first, then newest. Drafts are hidden in production builds. */
export async function getProjects(): Promise<Project[]> {
  const projects = await loadCollection('projects', ProjectFrontmatterSchema);
  return projects.filter(isVisible).sort((a, b) => {
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

export function renderProject(project: Project): Promise<ReactNode> {
  return renderMdx(project.body);
}
