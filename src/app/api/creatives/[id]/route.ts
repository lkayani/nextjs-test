// GET /api/creatives/:id - Get creative by ID
// PATCH /api/creatives/:id - Update creative
// DELETE /api/creatives/:id - Delete creative
import { NextResponse } from 'next/server';
import { creativeStore } from '@/lib/creativeStore';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const creative = creativeStore.getById(params.id);

  if (!creative) {
    return NextResponse.json(
      { error: 'Creative not found' },
      { status: 404 }
    );
  }

  return NextResponse.json(creative);
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const updated = creativeStore.update(params.id, body);

    if (!updated) {
      return NextResponse.json(
        { error: 'Creative not found' },
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
  const deleted = creativeStore.delete(params.id);

  if (!deleted) {
    return NextResponse.json(
      { error: 'Creative not found' },
      { status: 404 }
    );
  }

  return NextResponse.json({ success: true });
}
