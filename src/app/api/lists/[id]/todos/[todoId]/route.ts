import { NextResponse } from 'next/server';
import { todoStore } from '@/lib/todoStore';

// PATCH /api/lists/[id]/todos/[todoId] - Update a todo
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string; todoId: string }> }
) {
  try {
    const { todoId } = await params;
    const body = await request.json();

    const todo = todoStore.update(todoId, body);
    if (!todo) {
      return NextResponse.json(
        { error: 'Todo not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(todo);
  } catch (error) {
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
    const { todoId } = await params;
    const deleted = todoStore.delete(todoId);

    if (!deleted) {
      return NextResponse.json(
        { error: 'Todo not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete todo' },
      { status: 500 }
    );
  }
}
