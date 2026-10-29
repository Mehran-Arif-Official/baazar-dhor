import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

/**
 * Optimistic gate for protected routes (cookie presence). The pages themselves
 * re-validate the session on the server.
 */
export function middleware(request: NextRequest) {
  const session = getSessionCookie(request);
  if (!session) {
    const url = new URL("/signin", request.url);
    url.searchParams.set("redirect", request.nextUrl.pathname + request.nextUrl.search);
    url.searchParams.set("reason", "login-required");
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/product/:path*", "/profile/:path*"],
};
