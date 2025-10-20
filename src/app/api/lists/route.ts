import { NextResponse } from 'next/server';
import { listStore } from '@/lib/listStore';

// GET /api/lists - Get all lists
export async function GET() {
  console.log('[API] GET /api/lists - Request received at', new Date().toISOString());
  try {
    const lists = listStore.getAll();
    console.log('[API] GET /api/lists - Returning', lists.length, 'lists with status 200');
    return NextResponse.json(lists);
  } catch (error) {
    console.error('[API] GET /api/lists - Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch lists' },
      { status: 500 }
    );
  }
}

// POST /api/lists - Create a new list
export async function POST(request: Request) {
  console.log('[API] POST /api/lists - Request received at', new Date().toISOString());
  try {
    const body = await request.json();
    const { name } = body;
    console.log('[API] POST /api/lists - Request body:', { name });

    if (!name || typeof name !== 'string' || name.trim() === '') {
      console.log('[API] POST /api/lists - Bad request: invalid name');
      return NextResponse.json(
        { error: 'List name is required' },
        { status: 400 }
      );
    }

    const list = listStore.create(name.trim());
    console.log('[API] POST /api/lists - Created list with ID:', list.id, '- Returning status 201');
    return NextResponse.json(list, { status: 201 });
  } catch (error) {
    console.error('[API] POST /api/lists - Error:', error);
    return NextResponse.json(
      { error: 'Failed to create list' },
      { status: 500 }
    );
  }
}
