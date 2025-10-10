import { NextResponse } from 'next/server';
import { todoStore } from '@/lib/todoStore';
import { listStore } from '@/lib/listStore';

// GET /api/lists/[id]/todos - Get all todos for a list
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Verify list exists
    const list = listStore.getById(id);
    if (!list) {
      return NextResponse.json(
        { error: 'List not found' },
        { status: 404 }
      );
    }

    const todos = todoStore.getByListId(id);
    return NextResponse.json(todos);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch todos' },
      { status: 500 }
    );
  }
}

// POST /api/lists/[id]/todos - Create a new todo in a list
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { text } = body;

    // Verify list exists
    const list = listStore.getById(id);
    if (!list) {
      return NextResponse.json(
        { error: 'List not found' },
        { status: 404 }
      );
    }

    if (!text || typeof text !== 'string' || text.trim() === '') {
      return NextResponse.json(
        { error: 'Todo text is required' },
        { status: 400 }
      );
    }

    const todo = todoStore.create(text.trim(), id);
    return NextResponse.json(todo, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create todo' },
      { status: 500 }
    );
  }
}
