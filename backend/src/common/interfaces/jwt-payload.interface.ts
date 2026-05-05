export interface JwtPayload {
  sub: string;
  email: string;
  role: string;
  sessionToken?: string;
  iat?: number;
  exp?: number;
}
