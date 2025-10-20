import ms from 'ms';
import { NextResponse } from 'next/server';

export async function GET() {
  const oneDay = ms('1 day');
  const oneHour = ms('1h');

  return NextResponse.json({
    message: 'Testing ms package',
    oneDay,
    oneHour,
    timestamp: Date.now()
  });
}
