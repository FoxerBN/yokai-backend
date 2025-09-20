import { Request, Response, NextFunction } from 'express';

export function validateBody(req: Request, res: Response, next: NextFunction) {
  const data = JSON.stringify({ body: req.body, query: req.query, params: req.params });
  const dangerousPatterns = [
    /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|TRUNCATE|ALTER|CREATE|EXEC|UNION|LOAD_FILE|OUTFILE)\b.*\b(FROM|INTO|TABLE|DATABASE)\b)/gi,
    /\b(OR 1=1|AND 1=1|OR '1'='1'|--|#|\/\*|\*\/|;|\bUNION\b.*?\bSELECT\b)/gi,
    /\b(\$where|\$ne|\$gt|\$lt|\$regex|\$exists|\$not|\$or|\$and)\b/gi,
    /(<script|<\/script>|document\.cookie|eval\(|alert\(|javascript:|onerror=|onmouseover=)/gi,
    /(\bexec\s*xp_cmdshell|\bshutdown\b|\bdrop\s+database|\bdelete\s+from)/gi,
    /(\b(base64_decode|cmd|powershell|wget|curl|rm -rf|nc -e|perl -e|python -c)\b)/gi,
  ];
  for (const pattern of dangerousPatterns) {
    if (pattern.test(data)) {
      console.warn(`❌ Suspicious input detected: ${data}`);
      return res.status(400).json({ message: '🚨 Malicious content detected in request data' });
    }
  }
  next();
}
