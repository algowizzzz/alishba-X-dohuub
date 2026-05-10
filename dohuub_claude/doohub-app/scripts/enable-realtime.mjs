// One-off: enable Supabase Realtime publication on the tables the mobile app
// subscribes to (Booking, Order, Notification).
//
// Postgres throws "relation X is already member of publication Y" if a table
// is already published, so we ALTER each table inside its own try/catch and
// classify the result.
//
// Uses the Prisma client (so it picks up DATABASE_URL the same way the API
// does — no extra env wiring needed).
//
// Usage:
//   node --env-file=apps/api/.env scripts/enable-realtime.mjs
import { PrismaClient } from '@prisma/client';

const TABLES = ['Booking', 'Order', 'Notification'];

const prisma = new PrismaClient();

const added = [];
const alreadyOn = [];
const failed = [];

for (const table of TABLES) {
  try {
    // Use $executeRawUnsafe because we're injecting an identifier, not a
    // value — Prisma's tagged-template version would parameterize it.
    await prisma.$executeRawUnsafe(`ALTER PUBLICATION supabase_realtime ADD TABLE "${table}"`);
    console.log(`  added: "${table}"`);
    added.push(table);
  } catch (e) {
    const msg = e?.message || String(e);
    if (msg.includes('already member of publication')) {
      console.log(`  already on: "${table}"`);
      alreadyOn.push(table);
    } else {
      console.error(`  FAILED for "${table}":`, msg);
      failed.push({ table, error: msg });
    }
  }
}

await prisma.$disconnect();

console.log('\nSummary:');
console.log(`  added:      ${added.join(', ') || '(none)'}`);
console.log(`  already on: ${alreadyOn.join(', ') || '(none)'}`);
if (failed.length) {
  console.log(`  failed:     ${failed.map((f) => f.table).join(', ')}`);
  process.exit(1);
}
console.log('\nDone. Mobile clients can now subscribe to postgres_changes on these tables.');
