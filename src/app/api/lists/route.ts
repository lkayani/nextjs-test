import { NextResponse } from 'next/server';
import { listStore } from '@/lib/listStore';

// GET /api/lists - Get all lists
export async function GET() {
  try {
    const lists = listStore.getAll();
    return NextResponse.json(lists);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch lists' },
      { status: 500 }
    );
  }
}

// POST /api/lists - Create a new list
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name } = body;

    if (!name || typeof name !== 'string' || name.trim() === '') {
      return NextResponse.json(
        { error: 'List name is required' },
        { status: 400 }
      );
    }

    const list = listStore.create(name.trim());
    return NextResponse.json(list, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create list' },
      { status: 500 }
    );
  }
}
