// GET /api/tests - Get all A/B tests with optional status filter
// POST /api/tests - Create new A/B test
import { NextResponse } from 'next/server';
import { testStore } from '@/lib/testStore';
import type { ABTest, TestStatus } from '@/lib/types';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status') as TestStatus | null;

  const tests = status
    ? testStore.getByStatus(status)
    : testStore.getAll();

  return NextResponse.json(tests);
}

export async function POST(request: Request) {
  try {
    const body: ABTest = await request.json();

    if (!body.id || !body.name || !body.creativeIds || body.creativeIds.length < 2) {
      return NextResponse.json(
        { error: 'Missing required fields or insufficient creatives' },
        { status: 400 }
      );
    }

    const test = testStore.create(body);
    return NextResponse.json(test, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid request body' },
      { status: 400 }
    );
  }
}
