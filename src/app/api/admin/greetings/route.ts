import { NextResponse } from 'next/server';
import { getAllGreetings } from '@/lib/db';
import { checkAuth } from '@/lib/auth';

export async function GET() {
  // Enforce secure session check
  const isAuthenticated = await checkAuth();
  if (!isAuthenticated) {
    return NextResponse.json(
      { error: "Unauthorized access" },
      { status: 401 }
    );
  }

  try {
    const allGreetings = await getAllGreetings();
    return NextResponse.json(allGreetings);
  } catch (error: any) {
    console.error("Admin GET greetings error:", error);
    return NextResponse.json(
      { error: `Failed to load moderation list: ${error?.message || String(error)}` },
      { status: 500 }
    );
  }
}
