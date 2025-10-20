import { NextResponse } from 'next/server';
import { todoStore } from '@/lib/todoStore';

// PATCH /api/lists/[id]/todos/[todoId] - Update a todo
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string; todoId: string }> }
) {
  try {
    const { id, todoId } = await params;
    const body = await request.json();
    console.log('[API] PATCH /api/lists/' + id + '/todos/' + todoId + ' - Request received with body:', body);

    const todo = todoStore.update(todoId, body);
    if (!todo) {
      console.log('[API] PATCH /api/lists/' + id + '/todos/' + todoId + ' - Todo NOT FOUND - Returning 404');
      return NextResponse.json(
        { error: 'Todo not found' },
        { status: 404 }
      );
    }

    console.log('[API] PATCH /api/lists/' + id + '/todos/' + todoId + ' - Todo UPDATED - Returning 200');
    return NextResponse.json(todo);
  } catch (error) {
    console.error('[API] PATCH /api/lists/' + id + '/todos/' + todoId + ' - Error:', error);
    return NextResponse.json(
      { error: 'Failed to update todo' },
      { status: 500 }
    );
  }
}

// DELETE /api/lists/[id]/todos/[todoId] - Delete a todo
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string; todoId: string }> }
) {
  try {
    const { id, todoId } = await params;
    console.log('[API] DELETE /api/lists/' + id + '/todos/' + todoId + ' - Request received');
    const deleted = todoStore.delete(todoId);

    if (!deleted) {
      console.log('[API] DELETE /api/lists/' + id + '/todos/' + todoId + ' - Todo NOT FOUND - Returning 404');
      return NextResponse.json(
        { error: 'Todo not found' },
        { status: 404 }
      );
    }

    console.log('[API] DELETE /api/lists/' + id + '/todos/' + todoId + ' - Todo DELETED - Returning 200');
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[API] DELETE /api/lists/' + id + '/todos/' + todoId + ' - Error:', error);
    return NextResponse.json(
      { error: 'Failed to delete todo' },
      { status: 500 }
    );
  }
}
