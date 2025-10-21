// Performance Store - manages creative performance data
import { startOfDay, isAfter, isBefore } from 'date-fns';
import type { CreativePerformance, PerformanceMetrics } from './types';
import { generatePerformanceData } from './mockData';
import { creativeStore } from './creativeStore';

class PerformanceStore {
  private performances: Map<string, CreativePerformance> = new Map();

  constructor() {
    // Initialize with mock data for all creatives
    const creatives = creativeStore.getAll();
    creatives.forEach(creative => {
      const perfData = generatePerformanceData(creative, 90);
      perfData.forEach(perf => {
        this.performances.set(perf.id, perf);
      });
    });
  }

  getAll(): CreativePerformance[] {
    return Array.from(this.performances.values());
  }

  getById(id: string): CreativePerformance | undefined {
    return this.performances.get(id);
  }

  getByCreativeId(creativeId: string): CreativePerformance[] {
    return this.getAll().filter(perf => perf.creativeId === creativeId);
  }

  getByDateRange(startDate: Date, endDate: Date): CreativePerformance[] {
    const start = startOfDay(startDate);
    const end = startOfDay(endDate);

    return this.getAll().filter(perf => {
      const perfDate = startOfDay(perf.date);
      return !isBefore(perfDate, start) && !isAfter(perfDate, end);
    });
  }

  getByCreativeIdAndDateRange(
    creativeId: string,
    startDate: Date,
    endDate: Date
  ): CreativePerformance[] {
    return this.getByDateRange(startDate, endDate).filter(
      perf => perf.creativeId === creativeId
    );
  }

  // Calculate metrics from performance data
  calculateMetrics(performance: CreativePerformance): PerformanceMetrics {
    const ctr = performance.impressions > 0
      ? (performance.clicks / performance.impressions) * 100
      : 0;

    const ipm = performance.impressions > 0
      ? (performance.installs / performance.impressions) * 1000
      : 0;

    const cpi = performance.installs > 0
      ? performance.spend / performance.installs
      : 0;

    const roas = performance.spend > 0
      ? performance.revenue / performance.spend
      : 0;

    return {
      ...performance,
      ctr: parseFloat(ctr.toFixed(2)),
      ipm: parseFloat(ipm.toFixed(2)),
      cpi: parseFloat(cpi.toFixed(2)),
      roas: parseFloat(roas.toFixed(2)),
    };
  }

  getMetricsByCreativeId(creativeId: string): PerformanceMetrics[] {
    return this.getByCreativeId(creativeId).map(perf => this.calculateMetrics(perf));
  }

  getMetricsByDateRange(startDate: Date, endDate: Date): PerformanceMetrics[] {
    return this.getByDateRange(startDate, endDate).map(perf => this.calculateMetrics(perf));
  }

  // Aggregate performance data
  aggregateByCreative(creativeId: string): PerformanceMetrics | null {
    const performances = this.getByCreativeId(creativeId);
    if (performances.length === 0) return null;

    const totals = performances.reduce(
      (acc, perf) => ({
        impressions: acc.impressions + perf.impressions,
        clicks: acc.clicks + perf.clicks,
        installs: acc.installs + perf.installs,
        spend: acc.spend + perf.spend,
        revenue: acc.revenue + perf.revenue,
        d1Retention: acc.d1Retention + perf.d1Retention,
        d7Retention: acc.d7Retention + perf.d7Retention,
      }),
      {
        impressions: 0,
        clicks: 0,
        installs: 0,
        spend: 0,
        revenue: 0,
        d1Retention: 0,
        d7Retention: 0,
      }
    );

    const avgD1Retention = totals.d1Retention / performances.length;
    const avgD7Retention = totals.d7Retention / performances.length;

    const aggregated: CreativePerformance = {
      id: `agg_${creativeId}`,
      creativeId,
      date: new Date(),
      ...totals,
      d1Retention: parseFloat(avgD1Retention.toFixed(2)),
      d7Retention: parseFloat(avgD7Retention.toFixed(2)),
    };

    return this.calculateMetrics(aggregated);
  }

  create(performance: CreativePerformance): CreativePerformance {
    this.performances.set(performance.id, performance);
    return performance;
  }

  delete(id: string): boolean {
    return this.performances.delete(id);
  }
}

// Singleton pattern for Next.js hot reload
const globalForPerformanceStore = globalThis as unknown as {
  performanceStore: PerformanceStore | undefined;
};

if (!globalForPerformanceStore.performanceStore) {
  globalForPerformanceStore.performanceStore = new PerformanceStore();
}

export const performanceStore = globalForPerformanceStore.performanceStore;
