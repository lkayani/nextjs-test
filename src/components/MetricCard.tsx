'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowUp, ArrowDown, Minus } from 'lucide-react';
import { formatCurrency, formatNumber, formatPercentage, formatPercentageChange } from '@/lib/chartUtils';

interface MetricCardProps {
  title: string;
  value: number;
  format?: 'currency' | 'number' | 'percentage' | 'decimal';
  change?: number; // Percentage change
  icon?: React.ReactNode;
  decimals?: number;
}

export function MetricCard({
  title,
  value,
  format = 'number',
  change,
  icon,
  decimals = 2
}: MetricCardProps) {
  const formatValue = () => {
    switch (format) {
      case 'currency':
        return formatCurrency(value);
      case 'percentage':
        return formatPercentage(value, decimals);
      case 'decimal':
        return value.toFixed(decimals);
      case 'number':
      default:
        return formatNumber(value);
    }
  };

  const getChangeIcon = () => {
    if (change === undefined || change === 0) return <Minus className="h-3 w-3" />;
    if (change > 0) return <ArrowUp className="h-3 w-3" />;
    return <ArrowDown className="h-3 w-3" />;
  };

  const getChangeColor = () => {
    if (change === undefined || change === 0) return 'text-muted-foreground';
    if (change > 0) return 'text-green-600';
    return 'text-red-600';
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          {title}
        </CardTitle>
        {icon && <div className="text-muted-foreground">{icon}</div>}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{formatValue()}</div>
        {change !== undefined && (
          <div className={`flex items-center gap-1 text-xs ${getChangeColor()} mt-1`}>
            {getChangeIcon()}
            <span>{formatPercentageChange(change)} from last period</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
