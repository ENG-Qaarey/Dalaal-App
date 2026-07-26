export interface JwtPayload {
  sub: string;
  email: string;
  role: string;
  permissions: string[];
  sessionToken?: string;
  iat?: number;
  exp?: number;
}
