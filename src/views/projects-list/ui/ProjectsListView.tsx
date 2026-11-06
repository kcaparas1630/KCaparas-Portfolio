import { ProjectRow } from '@/entities/project';
import { getProjects } from '@/server/lib/content/projects';
import { PageIntro } from '@/shared/ui';

export const WORK_LEDE = "Things I've built, my day job, and what I decided along the way.";

export async function ProjectsListView() {
  const projects = await getProjects();
  return (
    <>
      <PageIntro title="Work" lede={WORK_LEDE} />
      {projects.map((project) => (
        <ProjectRow key={project.id} project={project} />
      ))}
    </>
  );
}
