import { NextResponse } from 'next/server';
import { getApprovedGreetings, addGreeting } from '@/lib/db';

// 1. GET: Fetch approved greetings
export async function GET() {
  try {
    const greetings = await getApprovedGreetings();
    return NextResponse.json(greetings);
  } catch (error) {
    console.error("Public GET greetings error:", error);
    return NextResponse.json(
      { error: "Failed to fetch greetings" },
      { status: 500 }
    );
  }
}

// 2. POST: Submit a new greeting (Pending moderation)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, message } = body;

    if (!name || !name.trim() || !message || !message.trim()) {
      return NextResponse.json(
        { error: "Name and message are required" },
        { status: 400 }
      );
    }

    if (name.length > 50 || message.length > 500) {
      return NextResponse.json(
        { error: "Input exceeds maximum allowed lengths" },
        { status: 400 }
      );
    }

    const newGreeting = await addGreeting(name, message);
    return NextResponse.json(newGreeting, { status: 201 });
  } catch (error) {
    console.error("Public POST greetings error:", error);
    return NextResponse.json(
      { error: "Failed to submit greeting" },
      { status: 500 }
    );
  }
}
