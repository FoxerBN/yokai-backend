import express from 'express';
import { Request, Response } from 'express';
import { verifyPassword, generateAdminToken, verifyToken } from '../services/authService';
import { MessageResponse } from '../interfaces/MessageResponse';

const authRouter = express.Router();

//* Admin login
authRouter.post<{}, MessageResponse | { message: string }>('/auth/login', async (req: Request, res: Response) => {
  try {
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ message: 'Password is required' });
    }

    const isValidPassword = await verifyPassword(password);
    
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    const token = generateAdminToken();

    // Set HTTP-only cookie (more secure than localStorage)
    res.cookie('adminToken', token, {
      httpOnly: true,
      secure: false, // HTTPS in production
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days in milliseconds
    });

    res.json({ 
      message: 'Login successful'
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Login failed' });
  }
});

//* Admin logout
authRouter.post<{}, MessageResponse>('/auth/logout', (req: Request, res: Response) => {
  res.clearCookie('adminToken');
  res.json({ message: 'Logged out successfully' });
});

//* Check if admin is logged in
authRouter.get<{}, MessageResponse | { isAdmin: boolean }>('/auth/check', (req: Request, res: Response) => {
  try {
    const token = req.cookies?.adminToken;
    
    if (!token) {
      return res.status(401).json({ isAdmin: false });
    }

    const decoded = verifyToken(token);
    
    if (!decoded || decoded.role !== 'admin') {
      res.clearCookie('adminToken'); // Clear invalid token
      return res.status(401).json({ isAdmin: false });
    }

    res.json({ isAdmin: true });
  } catch (error) {
    console.error('Auth check error:', error);
    res.clearCookie('adminToken'); // Clear invalid token
    res.json({ isAdmin: false });
  }
});

export default authRouter;