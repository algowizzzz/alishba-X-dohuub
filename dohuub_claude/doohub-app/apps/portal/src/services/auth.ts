import { supabase } from '../lib/supabase';

export type Role = 'CUSTOMER' | 'VENDOR' | 'ADMIN';

export interface SessionUser {
  id: string;
  email: string;
  role: Role;
}

const ROLE_KEY = 'dohuub_user_role';

function cacheRole(role: Role | null) {
  if (typeof window === 'undefined') return;
  if (role) localStorage.setItem(ROLE_KEY, role);
  else localStorage.removeItem(ROLE_KEY);
}

export function getCachedRole(): Role | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(ROLE_KEY) as Role | null;
}

/**
 * Sign in with email + password.
 *
 * We trust Supabase Auth's success and assume the role matches the requested
 * portal — the role is also encoded in the user's app_metadata when admins
 * create them. The API enforces RBAC server-side on every protected route,
 * so a CUSTOMER signing into /admin can technically reach the UI but every
 * data call to `/api/v1/admin/*` will return 403. Reading public.User from
 * the browser is blocked by RLS on the anon key, so we don't try.
 */
export async function signInAs(email: string, password: string, requiredRole: Role): Promise<SessionUser> {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw new Error(error.message);
  if (!data.user) throw new Error('No session returned');

  // Best-effort: read role from auth metadata if it was set there.
  const metaRole = (data.user.app_metadata?.role || data.user.user_metadata?.role) as Role | undefined;
  const role = metaRole ?? requiredRole;
  cacheRole(role);

  return {
    id: data.user.id,
    email: data.user.email || email,
    role,
  };
}

/** Sign out + clear local cache. */
export async function signOut() {
  await supabase.auth.signOut();
  cacheRole(null);
}

/** Resolve current session user from Supabase. Returns null if not logged in. */
export async function getCurrentUser(): Promise<SessionUser | null> {
  const { data } = await supabase.auth.getSession();
  if (!data.session) return null;
  const u = data.session.user;
  const role = ((u.app_metadata?.role || u.user_metadata?.role) as Role) || (getCachedRole() ?? 'CUSTOMER');
  return { id: u.id, email: u.email || '', role };
}
