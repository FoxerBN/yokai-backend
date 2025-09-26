import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../../services/authService';

/**
 * Middleware to verify admin authentication
 */
export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  try {
    const cookieToken = req.cookies?.adminToken;

    if (!cookieToken) {
      return res.status(401).json({ message: 'Access denied. Admin token required.' });
    }

    const decoded = verifyToken(cookieToken);
    
    if (!decoded || decoded.role !== 'admin') {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }

    (req as any).isAdmin = true;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({ message: 'Authentication failed' });
  }
}