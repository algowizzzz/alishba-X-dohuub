// One-off: ensure required Supabase Storage buckets exist & are public.
// Reads SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY from process.env.
// Run with the api/.env loaded:
//   node --env-file=apps/api/.env scripts/ensure-storage-buckets.mjs
import { createClient } from '@supabase/supabase-js';

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  console.error('Missing SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY in env');
  process.exit(1);
}

const sb = createClient(url, key, { auth: { persistSession: false } });

const REQUIRED = [
  { id: 'uploads', public: true },
  { id: 'listings', public: true },
];

const { data: existing, error: listErr } = await sb.storage.listBuckets();
if (listErr) {
  console.error('listBuckets failed:', listErr.message);
  process.exit(1);
}

const existingIds = new Set(existing.map((b) => b.id));

for (const b of REQUIRED) {
  if (existingIds.has(b.id)) {
    console.log(`bucket ${b.id} already exists`);
    const { error } = await sb.storage.updateBucket(b.id, { public: b.public });
    if (error) console.warn(`updateBucket(${b.id}) warning:`, error.message);
    continue;
  }
  const { error } = await sb.storage.createBucket(b.id, { public: b.public });
  if (error) {
    console.error(`createBucket(${b.id}) failed:`, error.message);
  } else {
    console.log(`created bucket ${b.id}`);
  }
}

console.log('done');
