export interface AuthRequest extends Request {
  isAdmin?: boolean;
  cookies: {
    adminToken?: string;
    [key: string]: string | undefined;
  };
}