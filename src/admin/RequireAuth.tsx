import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { adminApi } from './api';

export function RequireAuth() {
  const [state, setState] = useState<'loading' | 'ok' | 'no'>('loading');

  useEffect(() => {
    adminApi
      .me()
      .then((r) => setState(r.authenticated ? 'ok' : 'no'))
      .catch(() => setState('no'));
  }, []);

  if (state === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-950 text-sm text-gray-500">
        Checking session…
      </div>
    );
  }
  if (state === 'no') return <Navigate to="/admin/login" replace />;
  return <Outlet />;
}
