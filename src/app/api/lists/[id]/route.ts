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
    console.log('[API] GET /api/lists/' + id + ' - Request received at', new Date().toISOString());
    const list = listStore.getById(id);

    if (!list) {
      console.log('[API] GET /api/lists/' + id + ' - List NOT FOUND - Returning 404');
      return NextResponse.json(
        { error: 'List not found' },
        { status: 404 }
      );
    }

    console.log('[API] GET /api/lists/' + id + ' - List FOUND - Returning 200');
    return NextResponse.json(list);
  } catch (error) {
    console.error('[API] GET /api/lists/' + id + ' - Error:', error);
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
    console.log('[API] PATCH /api/lists/' + id + ' - Request received with body:', body);

    const list = listStore.update(id, body);
    if (!list) {
      console.log('[API] PATCH /api/lists/' + id + ' - List NOT FOUND - Returning 404');
      return NextResponse.json(
        { error: 'List not found' },
        { status: 404 }
      );
    }

    console.log('[API] PATCH /api/lists/' + id + ' - List UPDATED - Returning 200');
    return NextResponse.json(list);
  } catch (error) {
    console.error('[API] PATCH /api/lists/' + id + ' - Error:', error);
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
    console.log('[API] DELETE /api/lists/' + id + ' - Request received');
    const deleted = listStore.delete(id);

    if (!deleted) {
      console.log('[API] DELETE /api/lists/' + id + ' - List NOT FOUND - Returning 404');
      return NextResponse.json(
        { error: 'List not found' },
        { status: 404 }
      );
    }

    // Also delete all todos associated with this list
    todoStore.deleteByListId(id);

    console.log('[API] DELETE /api/lists/' + id + ' - List DELETED - Returning 200');
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[API] DELETE /api/lists/' + id + ' - Error:', error);
    return NextResponse.json(
      { error: 'Failed to delete list' },
      { status: 500 }
    );
  }
}
