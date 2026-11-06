import styles from './footer.module.css';

const EMAIL = 'kentcaparas12@gmail.com';
const GITHUB = 'https://github.com/kent-caparas';

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <span className={styles.links}>
          <a className={styles.link} href={`mailto:${EMAIL}`}>
            {EMAIL}
          </a>
          <a className={styles.link} href={GITHUB} rel="me noopener" target="_blank">
            github
          </a>
          <a className={styles.link} href="/rss.xml">
            rss
          </a>
        </span>
        <span>© {year} kent caparas</span>
      </div>
    </footer>
  );
}
