import jwt from 'jsonwebtoken';

// Refuse to operate with a missing / weak secret. The legacy /auth/* routes
// that use this util are not currently called from any client (mobile and
// portal both go through Supabase Auth), but we still don't want to silently
// fall back to a hard-coded value — that would defeat the rotation entirely.
const KNOWN_WEAK = new Set([
  'default-secret-change-in-production',
  'doohub-dev-jwt-secret-change-in-production',
  'doohub-dev-refresh-secret-change-in-production',
  'change-me',
  'secret',
]);

const getJwtSecret = () => {
  const s = process.env.JWT_SECRET;
  if (!s || s.length < 32 || KNOWN_WEAK.has(s)) {
    throw new Error(
      'JWT_SECRET is missing, too short, or set to a known weak value. ' +
        'Set it to at least 32 random characters in the Railway environment.'
    );
  }
  return s;
};
const JWT_EXPIRES_IN = '7d';
const REFRESH_TOKEN_EXPIRES_IN = '30d';

export interface TokenPayload {
  userId: string;
  email: string;
  role: string;
}

export function generateTokens(payload: TokenPayload) {
  const secret = getJwtSecret();
  
  const accessToken = jwt.sign(payload, secret, { expiresIn: JWT_EXPIRES_IN } as jwt.SignOptions);

  const refreshToken = jwt.sign(
    { ...payload, type: 'refresh' },
    secret,
    { expiresIn: REFRESH_TOKEN_EXPIRES_IN } as jwt.SignOptions
  );

  return { accessToken, refreshToken };
}

export function verifyToken(token: string): TokenPayload {
  const secret = getJwtSecret();
  return jwt.verify(token, secret) as TokenPayload;
}

export function decodeToken(token: string): TokenPayload | null {
  try {
    return jwt.decode(token) as TokenPayload;
  } catch {
    return null;
  }
}

