import type { MetadataRoute } from 'next';
import { postHref } from '@/entities/post';
import { getPublishedPosts } from '@/server/lib/content/posts';
import { projectHref } from '@/entities/project';
import { getProjects } from '@/server/lib/content/projects';
import { SITE_URL } from '@/server/lib/env';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, projects] = await Promise.all([getPublishedPosts(), getProjects()]);
  const paths = ['/', '/blog', '/projects', ...posts.map(postHref), ...projects.map(projectHref)];
  return paths.map((path) => ({ url: new URL(path, SITE_URL).href }));
}
