// GET /api/tests/:id - Get test by ID
// PATCH /api/tests/:id - Update test
// DELETE /api/tests/:id - Delete test
import { NextResponse } from 'next/server';
import { testStore } from '@/lib/testStore';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const test = testStore.getById(params.id);

  if (!test) {
    return NextResponse.json(
      { error: 'Test not found' },
      { status: 404 }
    );
  }

  return NextResponse.json(test);
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const updated = testStore.update(params.id, body);

    if (!updated) {
      return NextResponse.json(
        { error: 'Test not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid request body' },
      { status: 400 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const deleted = testStore.delete(params.id);

  if (!deleted) {
    return NextResponse.json(
      { error: 'Test not found' },
      { status: 404 }
    );
  }

  return NextResponse.json({ success: true });
}
