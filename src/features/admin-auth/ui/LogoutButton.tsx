'use client';

import { useAdminLogout } from '@/entities/admin-session';

export function LogoutButton() {
  const logout = useAdminLogout({
    onSettled() {
      window.location.href = '/admin';
    },
  });

  return (
    <button className="admin-logout" type="button" disabled={logout.isPending} onClick={() => logout.mutate()}>
      log out
    </button>
  );
}
