import { NextResponse } from "next/server";

export function middleware(req) {
  const token = req.cookies.get("token")?.value;

  const protectedRoutes = ["/products", "/dashboard"];

  if (protectedRoutes.some((p) => req.nextUrl.pathname.startsWith(p))) {
    if (!token) {
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }
  }

  return NextResponse.next();
}
export const config = {
  matcher: ["/products/:path*", "/dashboard/:path*"],
};