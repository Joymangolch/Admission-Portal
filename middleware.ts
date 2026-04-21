import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("auth-token")?.value;
  const { pathname } = request.nextUrl;

  // 1. Protected Candidate Routes
  if (pathname.startsWith("/apply") || pathname.startsWith("/candidate")) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // 2. Protected Admin Routes
  if (pathname.startsWith("/admin")) {
    const isAdmin = request.cookies.get("user-role")?.value === "admin";
    if (!token || !isAdmin) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // 3. Prevent Login access when already authenticated
  if (pathname === "/login" && token) {
    const role = request.cookies.get("user-role")?.value;
    if (role === "admin") {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    }
    return NextResponse.redirect(new URL("/candidate/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/apply/:path*",
    "/candidate/:path*",
    "/admin/:path*",
    "/login",
  ],
};
