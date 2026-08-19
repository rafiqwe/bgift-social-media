import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Extract and verify JWT directly from request cookies
  const token = await getToken({
    req,
    secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET,
  });

  const isValidUser = !!(token && token.id);
  const isAuthPage =
    pathname.startsWith("/login") || pathname.startsWith("/register");
  const isPublicPage = pathname === "/" || isAuthPage;

  // 1. Authenticated user accessing auth/public landing -> redirect to /feed
  if (isValidUser && isPublicPage) {
    return NextResponse.redirect(new URL("/feed", req.url));
  }

  // 2. Unauthenticated user accessing protected route -> redirect to /login
  if (!isValidUser && !isPublicPage) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};