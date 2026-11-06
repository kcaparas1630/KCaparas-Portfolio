'use client';

import { useState, type FormEvent } from 'react';
import { useAdminLogin } from '@/entities/admin-session';
import { ADMIN_WALL_PATH } from '@/shared/lib/admin-routes';

export function AdminLogin() {
  const [token, setToken] = useState('');
  const [error, setError] = useState('');

  const login = useAdminLogin({
    onSuccess() {
      window.location.href = ADMIN_WALL_PATH;
    },
    onError(err) {
      setError(err.message || 'Login failed.');
    },
  });

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!token || login.isPending) return;
    setError('');
    login.mutate({ token });
  }

  return (
    <form className="wall-form admin-login" onSubmit={handleSubmit} noValidate>
      <label className="wall-form__field">
        <span className="wall-form__label">admin token</span>
        <input
          type="password"
          value={token}
          autoComplete="off"
          placeholder="paste WALL_ADMIN_TOKEN"
          onChange={(e) => setToken(e.currentTarget.value)}
        />
      </label>
      <div className="wall-form__foot" style={{ justifyContent: 'flex-end' }}>
        <button className="wall-btn" type="submit" disabled={!token || login.isPending}>
          {login.isPending ? 'checking…' : 'enter'}
        </button>
      </div>
      {error && (
        <div className="wall-status" data-kind="error" role="status">
          {error}
        </div>
      )}
    </form>
  );
}
