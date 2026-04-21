import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const token = request.cookies.get("auth-token")?.value;
  const { pathname } = request.nextUrl;

  // Define protected routes
  const isCandidateRoute = pathname.startsWith("/candidate") || pathname.startsWith("/apply");
  const isAdminRoute = pathname.startsWith("/admin");
  const isPublicRoute = pathname === "/" || pathname === "/login" || pathname.startsWith("/public");

  // Redirect to login if accessing protected route without token
  if ((isCandidateRoute || isAdminRoute) && !token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect to dashboard if logged in and accessing login page
  if (pathname === "/login" && token) {
    return NextResponse.redirect(new URL("/candidate/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/candidate/:path*",
    "/admin/:path*",
    "/apply/:path*",
    "/login",
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
