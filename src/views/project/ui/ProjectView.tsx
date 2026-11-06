import { projectTransitionName, statusLabel, type Project } from '@/entities/project';
import { renderProject } from '@/server/lib/content/projects';
import styles from './project.module.css';

export async function ProjectView({ project }: { project: Project }) {
  const { name, status, description, tags, repo, demo } = project.data;
  const content = await renderProject(project);
  const statusClass = [styles.status, styles[status]].filter(Boolean).join(' ');

  return (
    <article>
      <div className={styles.head}>
        <div className={styles.row}>
          <h1 className={styles.name} style={{ viewTransitionName: projectTransitionName(project) }}>
            {name}
          </h1>
          <span className={statusClass}>{statusLabel(status)}</span>
        </div>
        <p className={styles.desc}>{description}</p>
        <div className={styles.tags}>
          {tags.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>
        <div className={styles.links}>
          {demo && (
            <a href={demo} rel="noopener" target="_blank">
              visit →
            </a>
          )}
          {repo && (
            <a href={repo} rel="noopener" target="_blank">
              source →
            </a>
          )}
        </div>
      </div>

      <div className={styles.prose}>{content}</div>

      <p className={styles.back}>
        <a href="/projects">← All work</a>
      </p>
    </article>
  );
}
