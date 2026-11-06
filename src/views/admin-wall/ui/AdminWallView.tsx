import { AdminNotes } from '@/widgets/admin-notes';
import styles from './admin-wall.module.css';

// The proxy guarantees a valid session before this renders; the widget fetches
// its own data through the cookie-gated admin procedures.
export function AdminWallView() {
  return (
    <section className={styles.intro}>
      <p className={styles.back}>
        <a href="/admin">← admin</a>
      </p>
      <h2 className={styles.title}>the wall · admin</h2>
      <AdminNotes />
    </section>
  );
}
