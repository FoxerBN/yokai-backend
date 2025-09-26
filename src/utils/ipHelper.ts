import { Request } from 'express';

export function getRealIP(req: Request): string {
  const forwarded = req.headers['x-forwarded-for'] as string;
  const realIP = req.headers['x-real-ip'] as string;
  
  if (realIP) return realIP;
  if (forwarded) return forwarded.split(',')[0].trim();
  
  return req.connection.remoteAddress || req.ip || 'unknown';
}