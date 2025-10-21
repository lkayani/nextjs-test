// Chart utilities: formatting, colors, and helpers for Recharts

// Number formatters
export function formatCurrency(value: number): string {
  if (value >= 1000000) {
    return `$${(value / 1000000).toFixed(1)}M`;
  }
  if (value >= 1000) {
    return `$${(value / 1000).toFixed(1)}K`;
  }
  return `$${value.toFixed(2)}`;
}

export function formatNumber(value: number): string {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`;
  }
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}K`;
  }
  return value.toString();
}

export function formatPercentage(value: number, decimals = 2): string {
  return `${value.toFixed(decimals)}%`;
}

export function formatDecimal(value: number, decimals = 2): string {
  return value.toFixed(decimals);
}

// Color palettes for charts
export const CHART_COLORS = {
  primary: 'hsl(var(--primary))',
  secondary: 'hsl(var(--secondary))',
  success: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444',
  info: '#3b82f6',
  purple: '#a855f7',
  pink: '#ec4899',
  teal: '#14b8a6',
  orange: '#f97316',
};

// Platform colors
export const PLATFORM_COLORS: Record<string, string> = {
  facebook: '#1877f2',
  google: '#ea4335',
  tiktok: '#000000',
  unity: '#222c37',
  ironsource: '#3d5afe',
};

// Multi-series color palette
export const SERIES_COLORS = [
  '#3b82f6', // blue
  '#10b981', // green
  '#f59e0b', // amber
  '#ef4444', // red
  '#a855f7', // purple
  '#ec4899', // pink
  '#14b8a6', // teal
  '#f97316', // orange
];

// Get color by index for multiple series
export function getSeriesColor(index: number): string {
  return SERIES_COLORS[index % SERIES_COLORS.length];
}

// Custom tooltip formatter for currency
export function currencyTooltipFormatter(value: number): string {
  return formatCurrency(value);
}

// Custom tooltip formatter for percentages
export function percentageTooltipFormatter(value: number): string {
  return formatPercentage(value);
}

// Format date for chart labels
export function formatChartDate(date: Date | string): string {
  if (typeof date === 'string') {
    return date; // Already formatted
  }
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

// Calculate percentage change
export function calculatePercentageChange(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / previous) * 100;
}

// Format percentage change with sign
export function formatPercentageChange(change: number): string {
  const sign = change >= 0 ? '+' : '';
  return `${sign}${change.toFixed(1)}%`;
}
