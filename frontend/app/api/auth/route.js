const API_URL = process.env.API_URL || "http://localhost:8080/api";
import { NextResponse } from "next/server"; 


export async function GET() {
  return Response.json({ 
    message: "Auth API endpoint",
    availableMethods: ["POST"],
    instructions: "Send POST request with {type: 'login'|'register', email, password}"
  });
}


export async function POST(req) {
  try {
    const body = await req.json();

    const isLogin = body.type === "login";
    const endpoint = isLogin ? "/login" : "/register";

    const res = await fetch(`${API_URL}${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      return Response.json(
        { error: error.error || "Authentication failed" },
        { status: res.status }
      );
    }

    const data = await res.json();
    
    const response = NextResponse.json(data, { status: 200 });
    
    response.cookies.set({
      name: 'token',
      value: data.token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7, 
      path: '/',
    });
    
    response.cookies.set({
      name: 'user',
      value: JSON.stringify(data.user),
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });

    return response;

  } catch (err) {
    return Response.json(
      { error: err.message },
      { status: 500 }
    );
  }
}