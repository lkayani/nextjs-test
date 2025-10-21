'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ComparisonBarChart } from '@/components/charts/ComparisonBarChart';
import { DistributionPieChart } from '@/components/charts/DistributionPieChart';
import { Globe } from 'lucide-react';
import type { PlatformPerformance } from '@/lib/types';
import { PLATFORM_COLORS, CHART_COLORS, formatCurrency, formatNumber } from '@/lib/chartUtils';

export default function PlatformsPage() {
  const [platformData, setPlatformData] = useState<PlatformPerformance[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPlatformData();
  }, []);

  const fetchPlatformData = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/platforms?days=30');
      if (res.ok) {
        const data = await res.json();
        setPlatformData(data);
      }
    } catch (error) {
      console.error('Failed to fetch platform data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-2">Platform Analytics</h1>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Platform Analytics</h1>
          <p className="text-muted-foreground">
            Compare performance across advertising platforms (Last 30 days)
          </p>
        </div>

        {/* Platform Performance Table */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Platform Overview
            </CardTitle>
            <CardDescription>Performance metrics by platform</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium">Platform</th>
                    <th className="text-right py-3 px-4 font-medium">Spend</th>
                    <th className="text-right py-3 px-4 font-medium">Installs</th>
                    <th className="text-right py-3 px-4 font-medium">CPI</th>
                    <th className="text-right py-3 px-4 font-medium">CTR</th>
                    <th className="text-right py-3 px-4 font-medium">Impressions</th>
                  </tr>
                </thead>
                <tbody>
                  {platformData.map((platform) => (
                    <tr key={platform.platform} className="border-b last:border-0 hover:bg-muted/50">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: PLATFORM_COLORS[platform.platform] }}
                          />
                          <span className="font-medium capitalize">{platform.platform}</span>
                        </div>
                      </td>
                      <td className="text-right py-3 px-4 font-medium">
                        {formatCurrency(platform.spend)}
                      </td>
                      <td className="text-right py-3 px-4">
                        {formatNumber(platform.installs)}
                      </td>
                      <td className="text-right py-3 px-4">
                        {formatCurrency(platform.cpi)}
                      </td>
                      <td className="text-right py-3 px-4">
                        {platform.ctr.toFixed(2)}%
                      </td>
                      <td className="text-right py-3 px-4">
                        {formatNumber(platform.impressions)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Spend Distribution</CardTitle>
              <CardDescription>Total spend by platform</CardDescription>
            </CardHeader>
            <CardContent>
              <DistributionPieChart
                data={platformData.map(p => ({
                  name: p.platform.charAt(0).toUpperCase() + p.platform.slice(1),
                  value: p.spend,
                  color: PLATFORM_COLORS[p.platform]
                }))}
                format="currency"
                height={350}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Installs by Platform</CardTitle>
              <CardDescription>Total installs delivered per platform</CardDescription>
            </CardHeader>
            <CardContent>
              <ComparisonBarChart
                data={platformData.map(p => ({
                  name: p.platform.charAt(0).toUpperCase() + p.platform.slice(1),
                  installs: p.installs
                }))}
                dataKeys={[
                  { key: 'installs', name: 'Installs', color: CHART_COLORS.success, format: 'number' }
                ]}
                height={350}
                layout="horizontal"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Cost per Install (CPI)</CardTitle>
              <CardDescription>CPI comparison across platforms</CardDescription>
            </CardHeader>
            <CardContent>
              <ComparisonBarChart
                data={platformData.map(p => ({
                  name: p.platform.charAt(0).toUpperCase() + p.platform.slice(1),
                  cpi: p.cpi
                }))}
                dataKeys={[
                  { key: 'cpi', name: 'CPI', color: CHART_COLORS.warning, format: 'currency' }
                ]}
                height={350}
                layout="horizontal"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Click-Through Rate (CTR)</CardTitle>
              <CardDescription>CTR performance by platform</CardDescription>
            </CardHeader>
            <CardContent>
              <ComparisonBarChart
                data={platformData.map(p => ({
                  name: p.platform.charAt(0).toUpperCase() + p.platform.slice(1),
                  ctr: p.ctr
                }))}
                dataKeys={[
                  { key: 'ctr', name: 'CTR', color: CHART_COLORS.info, format: 'percentage' }
                ]}
                height={350}
                layout="horizontal"
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
