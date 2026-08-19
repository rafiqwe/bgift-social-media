import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { pathname } = req.nextUrl;

  // 🔒 Validation Fix: Ensure session exists AND contains a valid database user ID
  const session = req.auth;
  const isValidUser = !!(session?.user && session.user.id);

  const isAuthPage =
    pathname.startsWith("/login") || pathname.startsWith("/register");
  const isPublicPage = pathname === "/" || isAuthPage;

  // 1. Valid user attempting to access auth pages/landing page -> redirect to /feed
  if (isValidUser && isPublicPage) {
    return NextResponse.redirect(new URL("/feed", req.url));
  }

  // 2. Invalid or deleted user trying to access protected routes -> redirect to /login
  if (!isValidUser && !isPublicPage) {
    // Clear invalid session cookie if present
    const response = NextResponse.redirect(new URL("/login", req.url));
    return response;
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};