import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import type { JwtPayload } from '../interfaces/JwtPayload';
dotenv.config();

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const JWT_SECRET = process.env.JWT_SECRET;

if (!ADMIN_PASSWORD || !JWT_SECRET) {
  throw new Error('ADMIN_PASSWORD and JWT_SECRET must be set in .env');
}

/**
 * Verify admin password
 */
export async function verifyPassword(inputPassword: string): Promise<boolean> {
  try {
    // ADMIN_PASSWORD is guaranteed to exist due to check above
    return await bcrypt.compare(inputPassword, ADMIN_PASSWORD!);
  } catch (error) {
    console.error('Error verifying password:', error);
    return false;
  }
}

/**
 * Generate admin JWT token
 */
export function generateAdminToken(): string {
  // JWT_SECRET is guaranteed to exist due to check above
  return jwt.sign(
    { 
      role: 'admin',
      timestamp: Date.now() 
    },
    JWT_SECRET!,
    { 
      expiresIn: '7d'
    }
  );
}

/**
 * Verify JWT token
 */
export function verifyToken(token: string): JwtPayload | null {
  try {
    // JWT_SECRET is guaranteed to exist due to check above
    const decoded = jwt.verify(token, JWT_SECRET!) as JwtPayload;
    return decoded;
  } catch (error) {
    console.error('Invalid token:', error);
    return null;
  }
}
