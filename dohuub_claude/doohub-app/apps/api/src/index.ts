import './env'; // must be first - loads + validates .env before any module reads process.env

import express from 'express';
import path from 'path';
import cors from 'cors';
import helmet from 'helmet';
import pinoHttp from 'pino-http';
import { logger } from './lib/logger';
import { initSentry, Sentry } from './lib/sentry';
import { globalLimiter, authLimiter, paymentLimiter } from './middleware/rateLimit';

initSentry();

// Import routes
import authRoutes from './routes/auth';
import userRoutes from './routes/users';
import addressRoutes from './routes/addresses';
import vendorRoutes from './routes/vendors';
import cleaningRoutes from './routes/cleaning';
import handymanRoutes from './routes/handyman';
import beautyRoutes from './routes/beauty';
import groceryRoutes from './routes/groceries';
import rentalRoutes from './routes/rentals';
import caregivingRoutes from './routes/caregiving';
// NEW listing routes
import foodRoutes from './routes/food';
import beautyProductRoutes from './routes/beauty-products';
import rideAssistanceRoutes from './routes/ride-assistance';
import companionshipRoutes from './routes/companionship';
import storesRoutes from './routes/stores';
import regionsRoutes from './routes/regions';
import statsRoutes from './routes/stats';
import uploadRoutes from './routes/upload';
import subscriptionRoutes from './routes/subscriptions';
import adminRoutes from './routes/admin';
import settingsRoutes from './routes/settings';
import bookingRoutes from './routes/bookings';
import orderRoutes from './routes/orders';
import cartRoutes from './routes/cart';
import reviewRoutes from './routes/reviews';
import paymentRoutes from './routes/payments';
import stripeWebhookRoutes from './routes/payments-webhook';
import chatRoutes from './routes/chat';
import notificationRoutes from './routes/notifications';
import reportRoutes from './routes/reports';

const app = express();
// Railway uses PORT, locally we use API_PORT
const PORT = process.env.PORT || process.env.API_PORT || 3001;

// Sentry request handler must come BEFORE other middleware to capture context.
if (process.env.SENTRY_DSN) {
  app.use(Sentry.Handlers.requestHandler());
}

// Security middleware
app.use(helmet());

// CORS — strict allowlist driven by ALLOWED_ORIGINS env var (comma-separated).
// In non-production we also allow localhost + Expo origins for DX.
const allowedOrigins = (process.env.ALLOWED_ORIGINS || '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow same-origin / native mobile apps / curl (no Origin header).
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) return callback(null, true);

      if (process.env.NODE_ENV !== 'production') {
        if (/^https?:\/\/localhost:\d+$/.test(origin)) return callback(null, true);
        if (/^exp:\/\/.+/.test(origin)) return callback(null, true);
      }

      logger.warn({ origin }, 'CORS: rejected origin');
      return callback(new Error(`CORS: origin ${origin} not allowed`));
    },
    credentials: true,
  })
);

// Global rate limit (production only — see middleware/rateLimit.ts).
app.use('/api/', globalLimiter);
// Tight limits on credential and money-touching endpoints.
app.use('/api/v1/auth/', authLimiter);
app.use('/api/v1/payments/', paymentLimiter);

// Stripe webhook MUST be mounted BEFORE express.json() so we can verify the
// raw body signature. See apps/api/src/routes/payments-webhook.ts.
app.use(
  '/api/v1/payments/webhook',
  express.raw({ type: 'application/json' }),
  stripeWebhookRoutes
);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Structured request logging.
app.use(
  pinoHttp({
    logger,
    customLogLevel: (_req, res, err) => {
      if (err || res.statusCode >= 500) return 'error';
      if (res.statusCode >= 400) return 'warn';
      return 'info';
    },
  })
);

// Static file serving for uploads
const UPLOAD_DIR = process.env.UPLOAD_DIR || path.join(__dirname, '../uploads');
app.use('/uploads', express.static(UPLOAD_DIR));

// Health check
app.get('/health', async (req, res) => {
  try {
    // Try to check database connection
    const { prisma } = await import('@doohub/database');
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: 'ok', database: 'connected', timestamp: new Date().toISOString() });
  } catch (error: any) {
    res.json({
      status: 'ok',
      database: 'disconnected',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// API Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/addresses', addressRoutes);
app.use('/api/v1/vendors', vendorRoutes);
app.use('/api/v1/services/cleaning', cleaningRoutes);
app.use('/api/v1/services/handyman', handymanRoutes);
app.use('/api/v1/services/beauty', beautyRoutes);
app.use('/api/v1/services/groceries', groceryRoutes);
app.use('/api/v1/services/rentals', rentalRoutes);
app.use('/api/v1/services/caregiving', caregivingRoutes);
// NEW listing routes
app.use('/api/v1/services/food', foodRoutes);
app.use('/api/v1/services/beauty-products', beautyProductRoutes);
app.use('/api/v1/services/ride-assistance', rideAssistanceRoutes);
app.use('/api/v1/services/companionship', companionshipRoutes);
// Store and Region routes
app.use('/api/v1/stores', storesRoutes);
app.use('/api/v1/regions', regionsRoutes);
// Dashboard stats routes
app.use('/api/v1/stats', statsRoutes);
// File upload routes
app.use('/api/v1/upload', uploadRoutes);
// Subscription routes
app.use('/api/v1/subscriptions', subscriptionRoutes);
// Admin routes
app.use('/api/v1/admin', adminRoutes);
// Settings routes
app.use('/api/v1/settings', settingsRoutes);
app.use('/api/v1/bookings', bookingRoutes);
app.use('/api/v1/orders', orderRoutes);
app.use('/api/v1/cart', cartRoutes);
app.use('/api/v1/reviews', reviewRoutes);
app.use('/api/v1/payments', paymentRoutes);
app.use('/api/v1/chat', chatRoutes);
app.use('/api/v1/notifications', notificationRoutes);
app.use('/api/v1/reports', reportRoutes);

// Also mount service routes directly (without /services/ prefix) for frontend compatibility
app.use('/api/v1/cleaning', cleaningRoutes);
app.use('/api/v1/handyman', handymanRoutes);
app.use('/api/v1/beauty', beautyRoutes);
app.use('/api/v1/groceries', groceryRoutes);
app.use('/api/v1/rentals', rentalRoutes);
app.use('/api/v1/caregiving', caregivingRoutes);
// NEW routes - direct access
app.use('/api/v1/food', foodRoutes);
app.use('/api/v1/beauty-products', beautyProductRoutes);
app.use('/api/v1/ride-assistance', rideAssistanceRoutes);
app.use('/api/v1/companionship', companionshipRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Sentry error handler must come BEFORE our own error handler.
if (process.env.SENTRY_DSN) {
  app.use(Sentry.Handlers.errorHandler());
}

// Error handler — never leak stack traces in production.
app.use((err: any, req: express.Request, res: express.Response, _next: express.NextFunction) => {
  logger.error({ err, path: req.path }, 'request failed');
  const status = err.status || 500;
  res.status(status).json({
    error: status >= 500 ? 'Internal server error' : err.message || 'Request failed',
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
  });
});

process.on('uncaughtException', (error) => {
  logger.fatal({ err: error }, 'Uncaught Exception');
});

process.on('unhandledRejection', (reason) => {
  logger.error({ reason }, 'Unhandled Rejection');
});

const server = app.listen(PORT, () => {
  logger.info(
    {
      port: PORT,
      env: process.env.NODE_ENV || 'development',
      dbConfigured: Boolean(process.env.DATABASE_URL),
      sentry: Boolean(process.env.SENTRY_DSN),
    },
    'DoHuub API started'
  );
});

server.on('error', (error) => {
  logger.error({ err: error }, 'Server error');
});

export default app;

