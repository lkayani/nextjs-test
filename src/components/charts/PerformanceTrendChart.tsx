'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { formatCurrency, formatPercentage, formatNumber, CHART_COLORS } from '@/lib/chartUtils';

interface DataPoint {
  date: string;
  [key: string]: string | number;
}

interface PerformanceTrendChartProps {
  data: DataPoint[];
  dataKeys: { key: string; name: string; color?: string; format?: 'currency' | 'percentage' | 'number' }[];
  height?: number;
}

export function PerformanceTrendChart({
  data,
  dataKeys,
  height = 300
}: PerformanceTrendChartProps) {
  const formatYAxis = (value: number, format?: string) => {
    switch (format) {
      case 'currency':
        return formatCurrency(value);
      case 'percentage':
        return formatPercentage(value, 0);
      case 'number':
        return formatNumber(value);
      default:
        return value.toString();
    }
  };

  const formatTooltipValue = (value: number, format?: string) => {
    switch (format) {
      case 'currency':
        return formatCurrency(value);
      case 'percentage':
        return formatPercentage(value);
      case 'number':
        return formatNumber(value);
      default:
        return value.toString();
    }
  };

  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
        <XAxis
          dataKey="date"
          stroke="hsl(var(--muted-foreground))"
          fontSize={12}
        />
        <YAxis
          stroke="hsl(var(--muted-foreground))"
          fontSize={12}
          tickFormatter={(value) => formatYAxis(value, dataKeys[0]?.format)}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: 'rgba(255, 255, 255, 0.98)',
            border: '1px solid hsl(var(--border))',
            borderRadius: '8px',
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
            zIndex: 1000,
            color: '#000',
            padding: '8px 12px',
          }}
          wrapperStyle={{
            zIndex: 1000,
          }}
          formatter={(value: number, name: string) => {
            const dataKey = dataKeys.find(dk => dk.name === name);
            return [formatTooltipValue(value, dataKey?.format), name];
          }}
        />
        <Legend />
        {dataKeys.map((dataKey, index) => (
          <Line
            key={dataKey.key}
            type="monotone"
            dataKey={dataKey.key}
            name={dataKey.name}
            stroke={dataKey.color || CHART_COLORS.primary}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4 }}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}
