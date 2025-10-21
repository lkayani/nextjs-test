// GET /api/creatives/:id/performance - Get performance data for a creative
import { NextResponse } from 'next/server';
import { subDays, parseISO } from 'date-fns';
import { performanceStore } from '@/lib/performanceStore';
import { creativeStore } from '@/lib/creativeStore';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  // Verify creative exists
  const creative = creativeStore.getById(params.id);
  if (!creative) {
    return NextResponse.json(
      { error: 'Creative not found' },
      { status: 404 }
    );
  }

  const { searchParams } = new URL(request.url);

  // Parse date range parameters
  const startDateParam = searchParams.get('startDate');
  const endDateParam = searchParams.get('endDate');
  const daysParam = searchParams.get('days');

  let startDate: Date;
  let endDate: Date = new Date();

  if (startDateParam && endDateParam) {
    // Use provided date range
    startDate = parseISO(startDateParam);
    endDate = parseISO(endDateParam);
  } else if (daysParam) {
    // Use days parameter (default to last 30 days)
    const days = parseInt(daysParam, 10);
    startDate = subDays(endDate, days);
  } else {
    // Default to last 30 days
    startDate = subDays(endDate, 30);
  }

  const performances = performanceStore.getByCreativeIdAndDateRange(
    params.id,
    startDate,
    endDate
  );

  // Calculate metrics for each performance
  const metrics = performances.map(perf => performanceStore.calculateMetrics(perf));

  return NextResponse.json(metrics);
}
