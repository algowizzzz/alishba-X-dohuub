import dotenv from 'dotenv';
import path from 'path';
import { z } from 'zod';

// Load .env from the api directory first, then the workspace root as fallback.
// MUST be imported before any module that reads process.env at module eval.
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

const isProd = process.env.NODE_ENV === 'production';

// Required everywhere
const baseSchema = z.object({
  DATABASE_URL: z.string().url(),
  SUPABASE_URL: z.string().url(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(10),
  JWT_SECRET: z.string().min(32),
});

// Stricter in production — these MUST be set for a real launch.
// Stripe is intentionally optional: payments routes return 503 cleanly when
// STRIPE_SECRET_KEY is absent, so the rest of the API can still serve.
// Email: either RESEND_API_KEY (HTTPS, Railway-friendly) OR SMTP_* must be set.
const prodOnlySchema = z.object({
  ALLOWED_ORIGINS: z.string().min(1, 'Set ALLOWED_ORIGINS (comma-separated) in production'),
  RESEND_API_KEY: z.string().optional(),
  SMTP_HOST: z.string().optional(),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
  SMTP_FROM: z.string().optional(),
});

const schema = isProd
  ? baseSchema.merge(prodOnlySchema).refine(
      (v) => Boolean(v.RESEND_API_KEY) || Boolean(v.SMTP_HOST && v.SMTP_USER && v.SMTP_PASS),
      {
        message:
          'Configure email: set RESEND_API_KEY (preferred on Railway) or SMTP_HOST + SMTP_USER + SMTP_PASS',
        path: ['RESEND_API_KEY'],
      }
    )
  : baseSchema;

const parsed = schema.safeParse(process.env);

if (!parsed.success) {
  const issues = parsed.error.issues
    .map((i) => `  - ${i.path.join('.')}: ${i.message}`)
    .join('\n');
  // eslint-disable-next-line no-console
  console.error(`\n[env] Invalid environment configuration:\n${issues}\n`);
  if (isProd) {
    process.exit(1);
  } else {
    console.warn('[env] Continuing in development mode despite missing vars.');
  }
}
