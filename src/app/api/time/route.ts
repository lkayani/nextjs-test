// GET /api/time - Returns the current time
import { NextResponse } from 'next/server';

export async function GET() {
  const now = new Date();

  return NextResponse.json({
    timestamp: now.toISOString(),
    unix: Math.floor(now.getTime() / 1000),
    formatted: now.toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZoneName: 'short'
    }),
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  });
}
