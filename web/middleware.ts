import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ROLE_HOME, ROLE_ROUTES } from "@/lib/role-routes";

function decodeJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const payload = JSON.parse(Buffer.from(parts[1], "base64url").toString("utf-8"));
    return payload;
  } catch {
    return null;
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("accessToken")?.value;

  const authRoutes = ["/login", "/register", "/forgot-password", "/reset-password"];
  const isAuthRoute = authRoutes.some((r) => pathname.startsWith(r));

  if (!token) {
    if (isAuthRoute) return NextResponse.next();
    if (pathname.startsWith("/pages/")) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  if (isAuthRoute) {
    const payload = decodeJwtPayload(token);
    const role = typeof payload?.role === "string" ? payload.role : undefined;
    const home = role ? ROLE_HOME[role] ?? "/pages/customer" : "/pages/customer";
    return NextResponse.redirect(new URL(home, request.url));
  }

  const payload = decodeJwtPayload(token);
  const role = typeof payload?.role === "string" ? payload.role : undefined;

  if (role && pathname.startsWith("/pages/")) {
    const allowedPrefixes = ROLE_ROUTES[role] ?? ["/pages/customer"];
    const isAllowed = allowedPrefixes.some((prefix) => pathname.startsWith(prefix));

    if (!isAllowed) {
      const home = ROLE_HOME[role] ?? "/pages/customer";
      return NextResponse.redirect(new URL(home, request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/pages/:path*",
    "/login",
    "/register",
  ],
};
