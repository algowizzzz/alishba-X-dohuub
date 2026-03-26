import express from 'express';
import path from 'path';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

// Load environment variables (try multiple paths for different environments)
dotenv.config(); // First try .env in current directory
dotenv.config({ path: '../../.env' }); // Then try root .env for local development

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
import chatRoutes from './routes/chat';
import notificationRoutes from './routes/notifications';
import reportRoutes from './routes/reports';

const app = express();
// Railway uses PORT, locally we use API_PORT
const PORT = process.env.PORT || process.env.API_PORT || 3001;

// Security middleware
app.use(helmet());
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:3002',
    'http://localhost:3003',
    'http://localhost:5173',
    'http://localhost:8081',
    'exp://localhost:8081',
    // Production URLs
    'https://dohuubclaude-production.up.railway.app',
    'https://dohuub-claude.vercel.app',
    process.env.FRONTEND_URL,
  ].filter(Boolean) as string[],
  credentials: true,
}));

// Rate limiting
// Only enable in production to avoid accidental lock-outs during local development / e2e testing.
if (process.env.NODE_ENV === 'production') {
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,
    message: { error: 'Too many requests, please try again later.' },
  });
  app.use('/api/', limiter);
}

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Logging
app.use(morgan('dev'));

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

// Error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

// Handle uncaught errors
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Start server
const server = app.listen(PORT, () => {
  console.log(`🚀 DoHuub API running on port ${PORT}`);
  console.log(`📚 Health check: /health`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Database URL configured: ${process.env.DATABASE_URL ? 'Yes' : 'No'}`);
});

server.on('error', (error) => {
  console.error('Server error:', error);
});

export default app;

