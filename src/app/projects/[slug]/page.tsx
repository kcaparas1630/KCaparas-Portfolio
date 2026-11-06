import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { pageMetadata } from '@/shared/lib/page-metadata';
import { getProjectById, getProjects } from '@/server/lib/content/projects';
import { ProjectView } from '@/views/project';

interface Props {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = false;

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map((project) => ({ slug: project.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectById(slug);
  if (!project) return {};
  return pageMetadata({
    path: `/projects/${project.id}`,
    title: `${project.data.name}, Kent Caparas`,
    description: project.data.description,
  });
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const project = await getProjectById(slug);
  if (!project) notFound();
  return <ProjectView project={project} />;
}
