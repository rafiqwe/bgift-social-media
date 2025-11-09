import { NextResponse } from "next/server";

export function middleware(req) {
  const token =
    req.cookies.get("authjs.session-token") ||
    req.cookies.get("__Secure-authjs.session-token");

  const { pathname } = req.nextUrl;
  const loggedIn = !!token;
  const authPage = ["/login", "/register"].some((p) => pathname.startsWith(p));
  const publicPage = pathname === "/" || authPage;

  if (loggedIn && publicPage)
    return NextResponse.redirect(new URL("/feed", req.url));

  if (!loggedIn && !publicPage)
    return NextResponse.redirect(new URL("/login", req.url));

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
