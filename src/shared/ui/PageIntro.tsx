import styles from './page-intro.module.css';

interface Props {
  title: string;
  lede?: string;
}

export function PageIntro({ title, lede }: Props) {
  return (
    <div className={styles.intro}>
      <h1 className={styles.title}>{title}</h1>
      {lede && <p className={styles.lede}>{lede}</p>}
    </div>
  );
}
