'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, Download, TrendingUp, Users } from 'lucide-react';
import { MetricCard } from '@/components/MetricCard';
import { PerformanceTrendChart } from '@/components/charts/PerformanceTrendChart';
import { ComparisonBarChart } from '@/components/charts/ComparisonBarChart';
import { DistributionPieChart } from '@/components/charts/DistributionPieChart';
import { format, subDays } from 'date-fns';
import type { DashboardSummary, CreativeSummary, PlatformPerformance } from '@/lib/types';
import { PLATFORM_COLORS, CHART_COLORS } from '@/lib/chartUtils';

export default function Home() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [topCreatives, setTopCreatives] = useState<CreativeSummary[]>([]);
  const [platformData, setPlatformData] = useState<PlatformPerformance[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch summary metrics
      const summaryRes = await fetch('/api/performance/summary?days=30');
      if (summaryRes.ok) {
        const data = await summaryRes.json();
        setSummary(data);
      }

      // Fetch top creatives (get all and calculate aggregates)
      const creativesRes = await fetch('/api/creatives?status=active');
      if (creativesRes.ok) {
        const creatives = await creativesRes.json();
        // For simplicity, we'll just show first 5
        setTopCreatives(creatives.slice(0, 5));
      }

      // Fetch platform performance
      const platformRes = await fetch('/api/platforms?days=30');
      if (platformRes.ok) {
        const data = await platformRes.json();
        setPlatformData(data);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Ad Creative Testing Dashboard</h1>
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Ad Creative Testing Dashboard</h1>
          <p className="text-muted-foreground">
            Monitor your mobile game ad creative performance across all platforms
          </p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <MetricCard
            title="Total Spend"
            value={summary?.totalSpend || 0}
            format="currency"
            icon={<DollarSign className="h-4 w-4" />}
          />
          <MetricCard
            title="Total Installs"
            value={summary?.totalInstalls || 0}
            format="number"
            icon={<Download className="h-4 w-4" />}
          />
          <MetricCard
            title="Average CPI"
            value={summary?.avgCPI || 0}
            format="currency"
            decimals={2}
            icon={<TrendingUp className="h-4 w-4" />}
          />
          <MetricCard
            title="Average ROAS"
            value={summary?.avgROAS || 0}
            format="decimal"
            decimals={2}
            icon={<Users className="h-4 w-4" />}
          />
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle>Platform Performance</CardTitle>
              <CardDescription>Spend distribution by platform (Last 30 days)</CardDescription>
            </CardHeader>
            <CardContent>
              <DistributionPieChart
                data={platformData.map(p => ({
                  name: p.platform.charAt(0).toUpperCase() + p.platform.slice(1),
                  value: p.spend,
                  color: PLATFORM_COLORS[p.platform]
                }))}
                format="currency"
                height={300}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Platform CPI Comparison</CardTitle>
              <CardDescription>Cost per install by platform</CardDescription>
            </CardHeader>
            <CardContent>
              <ComparisonBarChart
                data={platformData.map(p => ({
                  name: p.platform.charAt(0).toUpperCase() + p.platform.slice(1),
                  cpi: p.cpi
                }))}
                dataKeys={[
                  { key: 'cpi', name: 'CPI', color: CHART_COLORS.primary, format: 'currency' }
                ]}
                height={300}
                layout="horizontal"
              />
            </CardContent>
          </Card>
        </div>

        {/* Top Creatives Table */}
        <Card>
          <CardHeader>
            <CardTitle>Top Active Creatives</CardTitle>
            <CardDescription>Currently active ad creatives</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topCreatives.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No active creatives found</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-medium">Name</th>
                        <th className="text-left py-3 px-4 font-medium">Type</th>
                        <th className="text-left py-3 px-4 font-medium">Platform</th>
                        <th className="text-left py-3 px-4 font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {topCreatives.map((creative) => (
                        <tr key={creative.id} className="border-b last:border-0 hover:bg-muted/50">
                          <td className="py-3 px-4">{creative.name}</td>
                          <td className="py-3 px-4 capitalize">{creative.type}</td>
                          <td className="py-3 px-4 capitalize">{creative.platform}</td>
                          <td className="py-3 px-4">
                            <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                              creative.status === 'active' ? 'bg-green-100 text-green-700' :
                              creative.status === 'testing' ? 'bg-blue-100 text-blue-700' :
                              creative.status === 'paused' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-gray-100 text-gray-700'
                            }`}>
                              {creative.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
