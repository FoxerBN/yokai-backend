export interface JwtPayload {
  role: string;
  timestamp: number;
  iat?: number;
  exp?: number;
}