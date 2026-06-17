import { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { getCurrentUser, type Role, type SessionUser } from '../../services/auth';

interface Props {
  /** One or more allowed roles. The user's role must be in this list. */
  allow: Role[];
  /** Where to send the user if they're not signed in. */
  loginPath: string;
  children: React.ReactNode;
}

/**
 * Route guard that verifies the Supabase session and its server-signed role
 * (from auth.app_metadata) before rendering. localStorage is never trusted
 * for the role decision — the cached value is only a UX hint.
 */
export function ProtectedRoute({ allow, loginPath, children }: Props) {
  const [state, setState] = useState<{ status: 'loading' } | { status: 'ready'; user: SessionUser | null }>({
    status: 'loading',
  });
  const location = useLocation();

  useEffect(() => {
    let cancelled = false;
    getCurrentUser()
      .then((user) => {
        if (!cancelled) setState({ status: 'ready', user });
      })
      .catch(() => {
        if (!cancelled) setState({ status: 'ready', user: null });
      });
    return () => {
      cancelled = true;
    };
  }, [location.pathname]);

  if (state.status === 'loading') {
    return (
      <div className="flex h-screen w-full items-center justify-center text-sm text-neutral-500">
        Verifying access…
      </div>
    );
  }

  if (!state.user) {
    return <Navigate to={loginPath} replace state={{ from: location.pathname }} />;
  }

  if (!allow.includes(state.user.role)) {
    return <Navigate to={loginPath} replace state={{ from: location.pathname, reason: 'role' }} />;
  }

  return <>{children}</>;
}
