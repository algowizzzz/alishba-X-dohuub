import rateLimit from 'express-rate-limit';

const isProd = process.env.NODE_ENV === 'production';

// Bypass entirely outside production so local dev / e2e isn't blocked.
const noop = (_req: any, _res: any, next: any) => next();

export const globalLimiter = isProd
  ? rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 200,
      standardHeaders: true,
      legacyHeaders: false,
      message: { error: 'Too many requests, please try again later.' },
    })
  : noop;

// Tight limiter for credential / OTP endpoints — abuse magnet.
export const authLimiter = isProd
  ? rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 10,
      standardHeaders: true,
      legacyHeaders: false,
      keyGenerator: (req) => {
        const body = (req.body || {}) as { email?: string; phone?: string };
        return `${req.ip}:${body.email || body.phone || 'anon'}`;
      },
      message: { error: 'Too many auth attempts. Try again in 15 minutes.' },
    })
  : noop;

// Payment endpoints — money-touching.
export const paymentLimiter = isProd
  ? rateLimit({
      windowMs: 60 * 1000,
      max: 20,
      standardHeaders: true,
      legacyHeaders: false,
      message: { error: 'Too many payment requests, slow down.' },
    })
  : noop;
