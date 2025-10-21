// GET /api/performance/summary - Get dashboard summary metrics
import { NextResponse } from 'next/server';
import { subDays, parseISO } from 'date-fns';
import { performanceStore } from '@/lib/performanceStore';
import type { DashboardSummary } from '@/lib/types';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  // Parse date range parameters
  const startDateParam = searchParams.get('startDate');
  const endDateParam = searchParams.get('endDate');
  const daysParam = searchParams.get('days');

  let startDate: Date;
  let endDate: Date = new Date();

  if (startDateParam && endDateParam) {
    startDate = parseISO(startDateParam);
    endDate = parseISO(endDateParam);
  } else if (daysParam) {
    const days = parseInt(daysParam, 10);
    startDate = subDays(endDate, days);
  } else {
    // Default to last 30 days
    startDate = subDays(endDate, 30);
  }

  const performances = performanceStore.getByDateRange(startDate, endDate);

  // Calculate aggregate metrics
  const totals = performances.reduce(
    (acc, perf) => ({
      spend: acc.spend + perf.spend,
      installs: acc.installs + perf.installs,
      revenue: acc.revenue + perf.revenue,
      impressions: acc.impressions + perf.impressions,
      clicks: acc.clicks + perf.clicks,
    }),
    {
      spend: 0,
      installs: 0,
      revenue: 0,
      impressions: 0,
      clicks: 0,
    }
  );

  const summary: DashboardSummary = {
    totalSpend: parseFloat(totals.spend.toFixed(2)),
    totalInstalls: totals.installs,
    avgCPI: totals.installs > 0 ? parseFloat((totals.spend / totals.installs).toFixed(2)) : 0,
    avgROAS: totals.spend > 0 ? parseFloat((totals.revenue / totals.spend).toFixed(2)) : 0,
    totalRevenue: parseFloat(totals.revenue.toFixed(2)),
    totalImpressions: totals.impressions,
    totalClicks: totals.clicks,
    avgCTR: totals.impressions > 0 ? parseFloat(((totals.clicks / totals.impressions) * 100).toFixed(2)) : 0,
  };

  return NextResponse.json(summary);
}
