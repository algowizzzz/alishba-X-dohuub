// One-off migration: add User.stripeCustomerId column.
//
// We DON'T use `prisma db push` here because the production schema has drifted
// from the local Prisma schema (RLS policies, generated columns, etc), and a
// blind push would try to "fix" things we don't actually want to change.
// This script applies just the one column we need, idempotently.
//
// Usage:
//   node scripts/add-stripe-customer-id.mjs
//
// Requires DATABASE_URL to be set in the environment (or in apps/api/.env).
import { config } from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import pg from 'pg';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load DATABASE_URL from apps/api/.env if not already in process.env
config({ path: path.resolve(__dirname, '../apps/api/.env') });
config({ path: path.resolve(__dirname, '../.env') });

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error('ERROR: DATABASE_URL is not set.');
  process.exit(1);
}

const { Client } = pg;

async function main() {
  const client = new Client({ connectionString: DATABASE_URL });
  await client.connect();

  console.log('Applying: ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "stripeCustomerId" TEXT');
  await client.query('ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "stripeCustomerId" TEXT');

  console.log('Applying: CREATE UNIQUE INDEX IF NOT EXISTS "User_stripeCustomerId_key" ON "User"("stripeCustomerId")');
  await client.query(
    'CREATE UNIQUE INDEX IF NOT EXISTS "User_stripeCustomerId_key" ON "User"("stripeCustomerId")'
  );

  console.log('Done.');
  await client.end();
}

main().catch((err) => {
  console.error('FATAL', err);
  process.exit(1);
});
