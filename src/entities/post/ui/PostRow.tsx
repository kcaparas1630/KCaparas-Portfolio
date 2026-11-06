import { formatStamp, formatTag, postHref, postTransitionName } from '../lib/format';
import type { Post } from '../model/schema';
import styles from './post-row.module.css';

interface Props {
  post: Post;
  /** title and meta only, for the home page */
  compact?: boolean;
}

export function PostRow({ post, compact = false }: Props) {
  const { title, date, tag, readingTime, excerpt } = post.data;

  return (
    <a href={postHref(post)} className={styles.row} data-reveal>
      <div className={styles.meta}>
        <time dateTime={date.toISOString()}>{formatStamp(date)}</time>
        <span>{formatTag(tag)}</span>
        {readingTime && <span>{readingTime} min</span>}
      </div>
      <div className={styles.titleLine}>
        <h3 className={styles.title} style={{ viewTransitionName: postTransitionName(post) }}>
          {title}
        </h3>
        <span className={styles.arrow} aria-hidden="true">
          →
        </span>
      </div>
      {!compact && <p className={styles.excerpt}>{excerpt}</p>}
    </a>
  );
}
