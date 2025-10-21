'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Video, Image as ImageIcon, Gamepad2 } from 'lucide-react';
import { MetricCard } from '@/components/MetricCard';
import { PerformanceTrendChart } from '@/components/charts/PerformanceTrendChart';
import { format } from 'date-fns';
import type { Creative, PerformanceMetrics } from '@/lib/types';
import { CHART_COLORS } from '@/lib/chartUtils';

export default function CreativeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const creativeId = params.id as string;

  const [creative, setCreative] = useState<Creative | null>(null);
  const [performances, setPerformances] = useState<PerformanceMetrics[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (creativeId) {
      fetchCreativeData();
    }
  }, [creativeId]);

  const fetchCreativeData = async () => {
    try {
      setLoading(true);

      // Fetch creative details
      const creativeRes = await fetch(`/api/creatives/${creativeId}`);
      if (creativeRes.ok) {
        const data = await creativeRes.json();
        setCreative(data);
      }

      // Fetch performance data (last 30 days)
      const perfRes = await fetch(`/api/creatives/${creativeId}/performance?days=30`);
      if (perfRes.ok) {
        const data = await perfRes.json();
        setPerformances(data);
      }
    } catch (error) {
      console.error('Failed to fetch creative data:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateTotals = () => {
    if (performances.length === 0) {
      return {
        totalSpend: 0,
        totalInstalls: 0,
        avgCPI: 0,
        avgCTR: 0,
        avgROAS: 0,
      };
    }

    const totals = performances.reduce(
      (acc, perf) => ({
        spend: acc.spend + perf.spend,
        installs: acc.installs + perf.installs,
        impressions: acc.impressions + perf.impressions,
        clicks: acc.clicks + perf.clicks,
        revenue: acc.revenue + perf.revenue,
      }),
      { spend: 0, installs: 0, impressions: 0, clicks: 0, revenue: 0 }
    );

    return {
      totalSpend: totals.spend,
      totalInstalls: totals.installs,
      avgCPI: totals.installs > 0 ? totals.spend / totals.installs : 0,
      avgCTR: totals.impressions > 0 ? (totals.clicks / totals.impressions) * 100 : 0,
      avgROAS: totals.spend > 0 ? totals.revenue / totals.spend : 0,
    };
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Video className="h-5 w-5" />;
      case 'playable':
        return <Gamepad2 className="h-5 w-5" />;
      case 'static':
        return <ImageIcon className="h-5 w-5" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen p-8">
        <div className="max-w-7xl mx-auto">
          <Button variant="ghost" onClick={() => router.back()} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!creative) {
    return (
      <div className="min-h-screen p-8">
        <div className="max-w-7xl mx-auto">
          <Button variant="ghost" onClick={() => router.back()} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <p className="text-muted-foreground">Creative not found</p>
        </div>
      </div>
    );
  }

  const totals = calculateTotals();

  // Prepare chart data
  const chartData = performances.map(perf => ({
    date: format(new Date(perf.date), 'MMM d'),
    spend: perf.spend,
    installs: perf.installs,
    ctr: perf.ctr,
    cpi: perf.cpi,
    roas: perf.roas,
  }));

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <Button variant="ghost" onClick={() => router.back()} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        {/* Creative Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            {getTypeIcon(creative.type)}
            <h1 className="text-4xl font-bold">{creative.name}</h1>
          </div>
          <div className="flex flex-wrap gap-4 text-sm">
            <span className="text-muted-foreground">
              Platform: <span className="font-medium text-foreground capitalize">{creative.platform}</span>
            </span>
            <span className="text-muted-foreground">
              Type: <span className="font-medium text-foreground capitalize">{creative.type}</span>
            </span>
            <span className="text-muted-foreground">
              Status:{' '}
              <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                creative.status === 'active' ? 'bg-green-100 text-green-700' :
                creative.status === 'testing' ? 'bg-blue-100 text-blue-700' :
                creative.status === 'paused' ? 'bg-yellow-100 text-yellow-700' :
                'bg-gray-100 text-gray-700'
              }`}>
                {creative.status}
              </span>
            </span>
          </div>
        </div>

        {/* Creative Details */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Creative Elements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Hook</p>
                <p className="font-medium">{creative.elements.hook}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Theme</p>
                <p className="font-medium">{creative.elements.theme}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">CTA</p>
                <p className="font-medium">{creative.elements.cta}</p>
              </div>
              {creative.elements.character && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Character</p>
                  <p className="font-medium">{creative.elements.character}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Performance KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <MetricCard
            title="Total Spend"
            value={totals.totalSpend}
            format="currency"
          />
          <MetricCard
            title="Total Installs"
            value={totals.totalInstalls}
            format="number"
          />
          <MetricCard
            title="Avg CPI"
            value={totals.avgCPI}
            format="currency"
            decimals={2}
          />
          <MetricCard
            title="Avg CTR"
            value={totals.avgCTR}
            format="percentage"
            decimals={2}
          />
          <MetricCard
            title="Avg ROAS"
            value={totals.avgROAS}
            format="decimal"
            decimals={2}
          />
        </div>

        {/* Performance Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle>Spend & Installs Trend</CardTitle>
              <CardDescription>Daily performance over last 30 days</CardDescription>
            </CardHeader>
            <CardContent>
              <PerformanceTrendChart
                data={chartData}
                dataKeys={[
                  { key: 'spend', name: 'Spend', color: CHART_COLORS.primary, format: 'currency' },
                  { key: 'installs', name: 'Installs', color: CHART_COLORS.success, format: 'number' },
                ]}
                height={300}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>CTR Performance</CardTitle>
              <CardDescription>Click-through rate over time</CardDescription>
            </CardHeader>
            <CardContent>
              <PerformanceTrendChart
                data={chartData}
                dataKeys={[
                  { key: 'ctr', name: 'CTR', color: CHART_COLORS.info, format: 'percentage' },
                ]}
                height={300}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>CPI Trend</CardTitle>
              <CardDescription>Cost per install over time</CardDescription>
            </CardHeader>
            <CardContent>
              <PerformanceTrendChart
                data={chartData}
                dataKeys={[
                  { key: 'cpi', name: 'CPI', color: CHART_COLORS.warning, format: 'currency' },
                ]}
                height={300}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>ROAS Performance</CardTitle>
              <CardDescription>Return on ad spend over time</CardDescription>
            </CardHeader>
            <CardContent>
              <PerformanceTrendChart
                data={chartData}
                dataKeys={[
                  { key: 'roas', name: 'ROAS', color: CHART_COLORS.purple, format: 'number' },
                ]}
                height={300}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
