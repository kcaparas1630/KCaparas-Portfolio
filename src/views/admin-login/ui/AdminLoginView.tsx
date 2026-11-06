import { cookies } from 'next/headers';
import { AdminLogin, LogoutButton } from '@/features/admin-auth';
import { ADMIN_COOKIE, verifyAdminCookieValue } from '@/server/lib/admin-cookie';
import { ADMIN_WALL_PATH } from '@/shared/lib/admin-routes';
import '@/shared/styles/wall.css';
import styles from './admin-login.module.css';

export async function AdminLoginView() {
  const cookieStore = await cookies();
  const authed = verifyAdminCookieValue(cookieStore.get(ADMIN_COOKIE)?.value);

  return (
    <section className={styles.intro}>
      <h2 className={styles.title}>admin</h2>
      {authed ? (
        <div className="admin-dash">
          <p>you&apos;re in. choose an area.</p>
          <nav className="admin-links">
            <a className="wall-btn" href={ADMIN_WALL_PATH}>
              manage the wall →
            </a>
          </nav>
          <LogoutButton />
        </div>
      ) : (
        <>
          <p className={styles.lede}>enter your admin token to continue.</p>
          <AdminLogin />
        </>
      )}
    </section>
  );
}
