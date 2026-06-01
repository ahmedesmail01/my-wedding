import { NextResponse } from 'next/server';
import { getSessionSignature } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    const envUsername = process.env.ADMIN_USERNAME;
    const envPassword = process.env.ADMIN_PASSWORD;

    // Strict validation
    if (username === envUsername && password === envPassword) {
      const response = NextResponse.json({ success: true, message: "Authenticated successfully" });

      // Calculate 7-day expiration
      const oneWeekInSeconds = 60 * 60 * 24 * 7;

      // Set highly secure HTTP-Only session cookie
      response.cookies.set({
        name: 'wedding_session',
        value: getSessionSignature(),
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: oneWeekInSeconds,
      });

      return response;
    }

    return NextResponse.json(
      { error: "Invalid username or password" },
      { status: 401 }
    );
  } catch (error) {
    console.error("Admin Login API error:", error);
    return NextResponse.json(
      { error: "Internal server error during login" },
      { status: 500 }
    );
  }
}
