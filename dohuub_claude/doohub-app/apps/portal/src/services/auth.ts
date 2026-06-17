import { supabase } from '../lib/supabase';

export type Role = 'CUSTOMER' | 'VENDOR' | 'ADMIN';

export interface SessionUser {
  id: string;
  email: string;
  role: Role;
}

/**
 * Resolve the user's role strictly from the Supabase session's server-signed
 * app_metadata. user_metadata is writable by the user and must NOT be trusted
 * for role decisions. If no role is set in app_metadata, we default to the
 * least-privileged role (CUSTOMER). The API enforces RBAC on every protected
 * route, so a wrongly-elevated UI cannot fetch privileged data anyway.
 */
function roleFromSession(user: { app_metadata?: Record<string, unknown> } | null | undefined): Role {
  const r = user?.app_metadata?.role;
  if (r === 'ADMIN' || r === 'VENDOR' || r === 'CUSTOMER') return r;
  return 'CUSTOMER';
}

/**
 * Sign in with email + password.
 *
 * The portal the user signed in from (admin vs vendor) is irrelevant — the
 * server-signed role in app_metadata is the source of truth. If the resolved
 * role is not allowed for the portal they targeted, the caller should refuse
 * and sign them out.
 */
export async function signInAs(email: string, password: string, requiredRole: Role): Promise<SessionUser> {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw new Error(error.message);
  if (!data.user) throw new Error('No session returned');

  const role = roleFromSession(data.user);
  if (role !== requiredRole) {
    // Don't leave them holding a session for the wrong portal.
    await supabase.auth.signOut();
    throw new Error(`This account is not a ${requiredRole.toLowerCase()} account.`);
  }

  return {
    id: data.user.id,
    email: data.user.email || email,
    role,
  };
}

/** Sign out. */
export async function signOut() {
  await supabase.auth.signOut();
}

/** Resolve current session user from Supabase. Returns null if not logged in. */
export async function getCurrentUser(): Promise<SessionUser | null> {
  const { data } = await supabase.auth.getSession();
  if (!data.session) return null;
  const u = data.session.user;
  return { id: u.id, email: u.email || '', role: roleFromSession(u) };
}
