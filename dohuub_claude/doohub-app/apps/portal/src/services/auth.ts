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

async function fetchUserRow(userId: string): Promise<SessionUser | null> {
  const { data, error } = await supabase
    .from('User')
    .select('id, email, role, isActive')
    .eq('id', userId)
    .maybeSingle();
  if (error || !data || !data.isActive) return null;
  return { id: data.id, email: data.email, role: data.role as Role };
}

/**
 * Sign in with email + password and verify role.
 * Throws if user has wrong role for the requested portal.
 */
export async function signInAs(email: string, password: string, requiredRole: Role): Promise<SessionUser> {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw new Error(error.message);
  if (!data.user) throw new Error('No session returned');

  const user = await fetchUserRow(data.user.id);
  if (!user) {
    await supabase.auth.signOut();
    throw new Error('Account not found or inactive');
  }
  if (user.role !== requiredRole) {
    await supabase.auth.signOut();
    throw new Error(
      `This account is a ${user.role.toLowerCase()}. Please use the ${user.role.toLowerCase()} portal.`
    );
  }
  cacheRole(user.role);
  return user;
}

/** Sign out + clear local cache. */
export async function signOut() {
  await supabase.auth.signOut();
  cacheRole(null);
}

/** Resolve current session user from Supabase + DB. Returns null if not logged in. */
export async function getCurrentUser(): Promise<SessionUser | null> {
  const { data } = await supabase.auth.getSession();
  if (!data.session) return null;
  const user = await fetchUserRow(data.session.user.id);
  if (user) cacheRole(user.role);
  return user;
}
