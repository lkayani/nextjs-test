// GET /api/hello - Simple hello world endpoint
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    message: 'Hello, World!',
    timestamp: new Date().toISOString(),
  });
}
