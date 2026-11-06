import { projectHref, projectTransitionName, statusLabel } from '../lib/format';
import type { Project } from '../model/schema';
import styles from './project-row.module.css';

interface Props {
  project: Project;
}

export function ProjectRow({ project }: Props) {
  const { name, status, description, tags } = project.data;
  const statusClass = status === 'live' ? `${styles.status} ${styles.live}` : styles.status;

  return (
    <a href={projectHref(project)} className={styles.row} data-reveal>
      <div className={styles.head}>
        <h3 className={styles.name} style={{ viewTransitionName: projectTransitionName(project) }}>
          {name}
        </h3>
        <span className={statusClass}>{statusLabel(status)}</span>
      </div>
      <p className={styles.desc}>{description}</p>
      <div className={styles.tags}>
        {tags.map((tag) => (
          <span key={tag}>{tag}</span>
        ))}
      </div>
    </a>
  );
}
