// GET /api/platforms - Get platform-level analytics
import { NextResponse } from 'next/server';
import { subDays, parseISO } from 'date-fns';
import { performanceStore } from '@/lib/performanceStore';
import { creativeStore } from '@/lib/creativeStore';
import type { PlatformPerformance, Platform } from '@/lib/types';

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
  const creatives = creativeStore.getAll();

  // Create a map of creative ID to platform
  const creativePlatformMap = new Map<string, Platform>();
  creatives.forEach(creative => {
    creativePlatformMap.set(creative.id, creative.platform);
  });

  // Group performances by platform
  const platformData = new Map<Platform, {
    spend: number;
    installs: number;
    impressions: number;
    clicks: number;
  }>();

  performances.forEach(perf => {
    const platform = creativePlatformMap.get(perf.creativeId);
    if (!platform) return;

    const existing = platformData.get(platform) || {
      spend: 0,
      installs: 0,
      impressions: 0,
      clicks: 0,
    };

    platformData.set(platform, {
      spend: existing.spend + perf.spend,
      installs: existing.installs + perf.installs,
      impressions: existing.impressions + perf.impressions,
      clicks: existing.clicks + perf.clicks,
    });
  });

  // Calculate metrics for each platform
  const platformPerformances: PlatformPerformance[] = Array.from(platformData.entries()).map(
    ([platform, data]) => ({
      platform,
      spend: parseFloat(data.spend.toFixed(2)),
      installs: data.installs,
      cpi: data.installs > 0 ? parseFloat((data.spend / data.installs).toFixed(2)) : 0,
      roas: 0, // Would need revenue data per creative
      impressions: data.impressions,
      clicks: data.clicks,
      ctr: data.impressions > 0 ? parseFloat(((data.clicks / data.impressions) * 100).toFixed(2)) : 0,
    })
  );

  return NextResponse.json(platformPerformances);
}
