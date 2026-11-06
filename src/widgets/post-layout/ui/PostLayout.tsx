import type { ReactNode } from 'react';
import { formatStamp, formatTag, postTransitionName, type Post } from '@/entities/post';
import styles from './post-layout.module.css';

interface Props {
  post: Post;
  children: ReactNode;
}

export function PostLayout({ post, children }: Props) {
  const { title, date, tag, readingTime } = post.data;

  return (
    <article>
      <div className={styles.head}>
        <div className={styles.meta}>
          <time dateTime={date.toISOString()}>{formatStamp(date)}</time>
          <span>{formatTag(tag)}</span>
          {readingTime && <span>{readingTime} min</span>}
        </div>
        <h1 className={styles.title} style={{ viewTransitionName: postTransitionName(post) }}>
          {title}
        </h1>
      </div>

      <div className={styles.prose}>{children}</div>

      <p className={styles.back}>
        <a href="/blog">← All writing</a>
      </p>
    </article>
  );
}
