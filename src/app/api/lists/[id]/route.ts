import { NextResponse } from 'next/server';
import { listStore } from '@/lib/listStore';
import { todoStore } from '@/lib/todoStore';

// GET /api/lists/[id] - Get a specific list
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const list = listStore.getById(id);

    if (!list) {
      return NextResponse.json(
        { error: 'List not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(list);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch list' },
      { status: 500 }
    );
  }
}

// PATCH /api/lists/[id] - Update a list
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const list = listStore.update(id, body);
    if (!list) {
      return NextResponse.json(
        { error: 'List not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(list);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update list' },
      { status: 500 }
    );
  }
}

// DELETE /api/lists/[id] - Delete a list and all its todos
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const deleted = listStore.delete(id);

    if (!deleted) {
      return NextResponse.json(
        { error: 'List not found' },
        { status: 404 }
      );
    }

    // Also delete all todos associated with this list
    todoStore.deleteByListId(id);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete list' },
      { status: 500 }
    );
  }
}
