import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../../services/authService';
import { AuthRequest } from '../../interfaces/AuthRequest';

/**
 * Middleware to verify admin authentication
 */
export function requireAdmin(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    // Try to get token from cookie first, then from Authorization header
    const cookieToken = req.cookies.adminToken;
    
    const token = cookieToken;

    if (!token) {
      return res.status(401).json({ message: 'Access denied. Admin token required.' });
    }

    const decoded = verifyToken(token);
    
    if (!decoded || decoded.role !== 'admin') {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }

    req.isAdmin = true;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({ message: 'Authentication failed' });
  }
}