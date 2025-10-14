import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const pathname = req.nextUrl.pathname;

  const isAuthPage =
    pathname.startsWith("/login") || pathname.startsWith("/register");
  const isPublicPage = pathname === "/" || isAuthPage;

  // 🔹 If logged in, redirect away from "/" or auth pages
  if (isLoggedIn && isPublicPage) {
    return NextResponse.redirect(new URL("/feed", req.url));
  }

  // 🔹 If not logged in, redirect to login (protect all except public pages)
  if (!isLoggedIn && !isPublicPage) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
