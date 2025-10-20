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
    console.log('[API] GET /api/lists/' + id + '/todos - Request received at', new Date().toISOString());

    // Verify list exists
    const list = listStore.getById(id);
    if (!list) {
      console.log('[API] GET /api/lists/' + id + '/todos - List NOT FOUND - Returning 404');
      return NextResponse.json(
        { error: 'List not found' },
        { status: 404 }
      );
    }

    const todos = todoStore.getByListId(id);
    console.log('[API] GET /api/lists/' + id + '/todos - Returning', todos.length, 'todos with status 200');
    return NextResponse.json(todos);
  } catch (error) {
    console.error('[API] GET /api/lists/' + id + '/todos - Error:', error);
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
    console.log('[API] POST /api/lists/' + id + '/todos - Request received with text:', text);

    // Verify list exists
    const list = listStore.getById(id);
    if (!list) {
      console.log('[API] POST /api/lists/' + id + '/todos - List NOT FOUND - Returning 404');
      return NextResponse.json(
        { error: 'List not found' },
        { status: 404 }
      );
    }

    if (!text || typeof text !== 'string' || text.trim() === '') {
      console.log('[API] POST /api/lists/' + id + '/todos - Bad request: invalid text');
      return NextResponse.json(
        { error: 'Todo text is required' },
        { status: 400 }
      );
    }

    const todo = todoStore.create(text.trim(), id);
    console.log('[API] POST /api/lists/' + id + '/todos - Created todo with ID:', todo.id, '- Returning status 201');
    return NextResponse.json(todo, { status: 201 });
  } catch (error) {
    console.error('[API] POST /api/lists/' + id + '/todos - Error:', error);
    return NextResponse.json(
      { error: 'Failed to create todo' },
      { status: 500 }
    );
  }
}
