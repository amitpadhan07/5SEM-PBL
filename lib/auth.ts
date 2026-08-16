import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key_here_min_32_characters';
const JWT_EXPIRY = process.env.JWT_EXPIRY || '7d';
const REFRESH_TOKEN_EXPIRY = process.env.REFRESH_TOKEN_EXPIRY || '30d';

export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

// Hash password
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

// Compare password
export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// Generate JWT token
export function generateJWT(payload: Omit<JWTPayload, 'iat' | 'exp'>): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRY as jwt.SignOptions['expiresIn'] });
}

// Verify JWT token
export function verifyJWT(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch (error) {
    return null;
  }
}

// Generate refresh token
export function generateRefreshToken(userId: string): string {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRY as jwt.SignOptions['expiresIn'] });
}

// Verify refresh token
export function verifyRefreshToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch (error) {
    return null;
  }
}

// Generate OTP
export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Hash OTP
export async function hashOTP(otp: string): Promise<string> {
  return bcrypt.hash(otp, 12);
}

// Verify OTP
export async function verifyOTP(otp: string, hash: string): Promise<boolean> {
  return bcrypt.compare(otp, hash);
}

// Generate random token (for password reset, etc.)
export function generateRandomToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

// Hash token
export async function hashToken(token: string): Promise<string> {
  return bcrypt.hash(token, 12);
}

// Verify token
export async function verifyToken(token: string, hash: string): Promise<boolean> {
  return bcrypt.compare(token, hash);
}

// Generate unique request ID
export function generateRequestId(): string {
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substring(2, 8);
  return `VR-${timestamp}-${randomStr}`.toUpperCase();
}
