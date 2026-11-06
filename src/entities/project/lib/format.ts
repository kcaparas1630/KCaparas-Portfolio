import type { Project, ProjectStatus } from '../model/schema';

const STATUS_LABELS: Record<ProjectStatus, string> = {
  live: 'live',
  broken: 'broken',
  wip: 'wip',
  archived: 'archived',
  job: 'day job',
};

/** Display label for a project status. */
export function statusLabel(status: ProjectStatus): string {
  return STATUS_LABELS[status];
}

/** Shared name so the row title morphs into the page heading. */
export function projectTransitionName(project: Pick<Project, 'id'>): string {
  return `project-${project.id.replace(/[^a-z0-9-]/gi, '-')}`;
}

export function projectHref(project: Pick<Project, 'id'>): string {
  return `/projects/${project.id}`;
}

export const isJob = (project: Project): boolean => project.data.status === 'job';
