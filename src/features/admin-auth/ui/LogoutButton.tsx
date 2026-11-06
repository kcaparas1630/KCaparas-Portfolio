'use client';

import { useAdminLogout } from '@/entities/admin-session';
import { ADMIN_PATH } from '@/shared/lib/admin-routes';

export function LogoutButton() {
  const logout = useAdminLogout({
    onSettled() {
      window.location.href = ADMIN_PATH;
    },
  });

  return (
    <button className="admin-logout" type="button" disabled={logout.isPending} onClick={() => logout.mutate()}>
      log out
    </button>
  );
}
