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

  // Map Supabase auth user → public.User row. Trigger handle_new_auth_user
  // creates the row on signup, so it should exist.
  const user = await prisma.user.findUnique({
    where: { id: authUser.id },
    select: { id: true, email: true, role: true, isActive: true },
  });

  if (!user || !user.isActive) return null;
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
