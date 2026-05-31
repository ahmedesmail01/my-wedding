import { NextResponse } from 'next/server';
import { deleteGreeting } from '@/lib/db';
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

    const success = await deleteGreeting(id);
    if (success) {
      return NextResponse.json({ success: true, message: "Greeting deleted successfully" });
    }

    return NextResponse.json(
      { error: "Failed to delete greeting. ID not found." },
      { status: 404 }
    );
  } catch (error: any) {
    console.error("Admin delete greeting error:", error);
    return NextResponse.json(
      { error: `Internal server error: ${error?.message || String(error)}` },
      { status: 500 }
    );
  }
}
