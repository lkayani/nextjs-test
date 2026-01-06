// GET /api/hello - Simple hello world endpoint
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    message: 'Hello, Universe!',
    timestamp: new Date().toISOString(),
  });
}
