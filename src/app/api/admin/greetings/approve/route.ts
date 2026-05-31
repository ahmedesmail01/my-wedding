import { NextResponse } from 'next/server';
import { approveGreeting } from '@/lib/db';
import { checkAuth } from '@/lib/auth';

export async function POST(request: Request) {
  const isAuthenticated = await checkAuth();
  if (!isAuthenticated) {
    return NextResponse.json(
      { error: "Unauthorized access" },
      { status: 401 }
    );
  }

  try {
    const { id } = await request.json();
    if (!id || typeof id !== 'number') {
      return NextResponse.json(
        { error: "Valid greeting ID is required" },
        { status: 400 }
      );
    }

    const success = await approveGreeting(id);
    if (success) {
      return NextResponse.json({ success: true, message: "Greeting approved successfully" });
    }

    return NextResponse.json(
      { error: "Failed to approve greeting. ID not found." },
      { status: 404 }
    );
  } catch (error) {
    console.error("Admin approve greeting error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
