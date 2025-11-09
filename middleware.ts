import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const loggedIn = !!req.auth;
  const authPage = ["/login", "/register"].some((p) => pathname.startsWith(p));
  const publicPage = pathname === "/" || authPage;

  if (loggedIn && publicPage)
    return NextResponse.redirect(new URL("/feed", req.url));

  if (!loggedIn && !publicPage)
    return NextResponse.redirect(new URL("/login", req.url));

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
