// GET /api/creatives - Get all creatives with optional filters
// POST /api/creatives - Create new creative
import { NextResponse } from 'next/server';
import { creativeStore } from '@/lib/creativeStore';
import type { Creative, CreativeStatus, Platform, CreativeType } from '@/lib/types';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const status = searchParams.get('status') as CreativeStatus | null;
  const platform = searchParams.get('platform') as Platform | null;
  const type = searchParams.get('type') as CreativeType | null;
  const search = searchParams.get('search');

  const filters: {
    status?: CreativeStatus;
    platform?: Platform;
    type?: CreativeType;
    search?: string;
  } = {};

  if (status) filters.status = status;
  if (platform) filters.platform = platform;
  if (type) filters.type = type;
  if (search) filters.search = search;

  const creatives = Object.keys(filters).length > 0
    ? creativeStore.filter(filters)
    : creativeStore.getAll();

  return NextResponse.json(creatives);
}

export async function POST(request: Request) {
  try {
    const body: Creative = await request.json();

    if (!body.id || !body.name || !body.type || !body.platform) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const creative = creativeStore.create(body);
    return NextResponse.json(creative, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid request body' },
      { status: 400 }
    );
  }
}
