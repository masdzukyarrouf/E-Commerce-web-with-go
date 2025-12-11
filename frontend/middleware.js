import { NextResponse } from "next/server";

export async function middleware(req) {
  const token = req.cookies.get("token")?.value;
  const protectedRoutes = ["/products", "/dashboard"];

  if (protectedRoutes.some((p) => req.nextUrl.pathname.startsWith(p))) {
    if (!token) {
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }

    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const payload = JSON.parse(Buffer.from(base64, 'base64').toString());
      
      const response = NextResponse.next();
      
      response.cookies.set({
        name: 'user',
        value: JSON.stringify({
          id: payload.userId || payload.user_id,
          email: payload.email,
          role: payload.role || 'user',
          name: payload.name || payload.email?.split('@')[0]
        }),
        httpOnly: false, 
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
        maxAge: 60 * 60 * 24 * 7 
      });

      return response;

    } catch (error) {
      console.error('Token error:', error);
      const response = NextResponse.redirect(new URL("/auth/login", req.url));
      response.cookies.delete("token");
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/products/:path*", "/dashboard/:path*"],
};