import { z } from 'zod';

export const ProjectStatusSchema = z.enum(['live', 'broken', 'wip', 'archived', 'job']);
export type ProjectStatus = z.infer<typeof ProjectStatusSchema>;

export const ProjectFrontmatterSchema = z.object({
  name: z.string(),
  status: ProjectStatusSchema,
  description: z.string(),
  tags: z.array(z.string()),
  repo: z.string().url().optional(),
  demo: z.string().url().optional(),
  date: z.coerce.date().optional(), // when it shipped, the day job has none
  draft: z.boolean().default(false),
});

export type ProjectFrontmatter = z.output<typeof ProjectFrontmatterSchema>;

export interface Project {
  /** the slug */
  id: string;
  data: ProjectFrontmatter;
  /** where the MDX body lives in object storage */
  s3Key: string;
}
