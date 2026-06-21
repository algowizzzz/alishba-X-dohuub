import { Request, Response, NextFunction } from 'express';
import { prisma } from '@doohub/database';
import { supabase } from '../utils/supabase';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: 'CUSTOMER' | 'VENDOR' | 'ADMIN';
  };
}

async function resolveUserFromToken(token: string) {
  if (!supabase) return null;
  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data?.user) return null;
  const authUser = data.user;

  const user = await prisma.user.findUnique({
    where: { id: authUser.id },
    select: { id: true, email: true, role: true, isActive: true, status: true },
  });

  // Block inactive OR moderation-suspended/banned users. Suspended customers
  // must not be able to keep using the mobile app after admin flips the row.
  if (!user || !user.isActive) return null;
  if (user.status === 'SUSPENDED' || user.status === 'BANNED') return null;

  return {
    id: user.id,
    email: user.email,
    role: user.role as 'CUSTOMER' | 'VENDOR' | 'ADMIN',
  };
}

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    const user = await resolveUserFromToken(token);

    if (!user) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(500).json({ error: 'Authentication failed' });
  }
};

export const requireRole = (...roles: ('CUSTOMER' | 'VENDOR' | 'ADMIN')[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }

    next();
  };
};

export const requireAdmin = requireRole('ADMIN');

// Block writes for vendors whose admin-side status is SUSPENDED/REJECTED.
// Allow read of /vendors/me itself so the portal can render a "suspended"
// banner; downstream write routes wrap with this middleware.
export const requireActiveVendor = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Not authenticated' });
    if (req.user.role !== 'VENDOR') return res.status(403).json({ error: 'Vendor account required' });

    const vendor = await prisma.vendor.findFirst({
      where: { userId: req.user.id },
      select: { status: true, isActive: true },
    });
    if (!vendor) return res.status(403).json({ error: 'Vendor profile not found' });
    if (vendor.status === 'SUSPENDED' || vendor.status === 'REJECTED' || vendor.isActive === false) {
      return res.status(403).json({ error: 'Vendor account is suspended' });
    }
    next();
  } catch (e) {
    console.error('requireActiveVendor error:', e);
    res.status(500).json({ error: 'Vendor check failed' });
  }
};

export const optionalAuth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next();
    }
    const token = authHeader.split(' ')[1];
    const user = await resolveUserFromToken(token);
    if (user) req.user = user;
    next();
  } catch {
    next();
  }
};
