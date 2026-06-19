import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.warn('Supabase credentials not configured. File uploads will use local storage fallback.');
}

export const supabase = supabaseUrl && supabaseServiceKey
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })
  : null;

export const STORAGE_BUCKETS = {
  LISTINGS: 'listings',
  UPLOADS: 'uploads',
} as const;

export const getPublicUrl = (bucket: string, path: string): string => {
  if (!supabaseUrl) return '';
  return `${supabaseUrl}/storage/v1/object/public/${bucket}/${path}`;
};

/**
 * Stamp the server-signed role onto a Supabase auth user's `app_metadata`.
 * The portal's ProtectedRoute trusts only `app_metadata.role` (never the
 * user-writable `user_metadata`), so without this call a freshly-created
 * vendor or admin would resolve to CUSTOMER on the next sign-in and bounce
 * off every protected route.
 *
 * Best-effort: missing service-role config or transient auth errors only
 * log and continue — the caller's primary write (DB insert) is the source
 * of truth.
 */
export async function setAuthUserRole(
  userId: string,
  role: 'CUSTOMER' | 'VENDOR' | 'ADMIN'
): Promise<void> {
  if (!supabase) return;
  try {
    await supabase.auth.admin.updateUserById(userId, {
      app_metadata: { role },
    });
  } catch (e) {
    console.error(`[setAuthUserRole] failed to set role=${role} on ${userId}:`, e);
  }
}
