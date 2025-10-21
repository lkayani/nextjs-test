// Data models for Mobile Game Ad Creative Testing Dashboard

export type Platform = 'facebook' | 'google' | 'tiktok' | 'unity' | 'ironsource';
export type CreativeType = 'video' | 'static' | 'playable';
export type CreativeStatus = 'active' | 'paused' | 'testing' | 'archived';
export type TestStatus = 'running' | 'completed';

export interface Creative {
  id: string;
  name: string;
  type: CreativeType;
  platform: Platform;
  thumbnailUrl: string;
  duration?: number; // in seconds, for videos
  createdDate: Date;
  status: CreativeStatus;
  elements: {
    hook: string;
    character?: string;
    theme: string;
    cta: string;
  };
}

export interface CreativePerformance {
  id: string;
  creativeId: string;
  date: Date;
  impressions: number;
  clicks: number;
  installs: number;
  spend: number;
  revenue: number;
  d1Retention: number; // percentage (0-100)
  d7Retention: number; // percentage (0-100)
}

// Calculated metrics derived from CreativePerformance
export interface PerformanceMetrics extends CreativePerformance {
  ctr: number;  // click-through rate (percentage)
  ipm: number;  // installs per mille (thousand impressions)
  cpi: number;  // cost per install
  roas: number; // return on ad spend
}

export interface ABTest {
  id: string;
  name: string;
  status: TestStatus;
  startDate: Date;
  endDate?: Date;
  creativeIds: string[];
  winner?: string; // creativeId of winner
  confidence: number; // statistical confidence (0-100)
}

export interface DashboardSummary {
  totalSpend: number;
  totalInstalls: number;
  avgCPI: number;
  avgROAS: number;
  totalRevenue: number;
  totalImpressions: number;
  totalClicks: number;
  avgCTR: number;
}

export interface PlatformPerformance {
  platform: Platform;
  spend: number;
  installs: number;
  cpi: number;
  roas: number;
  impressions: number;
  clicks: number;
  ctr: number;
}

export interface CreativeSummary extends Creative {
  totalSpend: number;
  totalInstalls: number;
  cpi: number;
  ctr: number;
  roas: number;
}

// Helper type for time-series data
export interface TimeSeriesDataPoint {
  date: string; // formatted date string for charts
  [key: string]: string | number; // flexible for multiple metrics
}
