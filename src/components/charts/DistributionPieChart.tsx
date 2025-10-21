'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { formatCurrency, formatPercentage, formatNumber, SERIES_COLORS } from '@/lib/chartUtils';

interface DataPoint {
  name: string;
  value: number;
  color?: string;
}

interface DistributionPieChartProps {
  data: DataPoint[];
  height?: number;
  innerRadius?: number; // Set to 0 for pie, 60 for donut
  format?: 'currency' | 'percentage' | 'number';
}

export function DistributionPieChart({
  data,
  height = 300,
  innerRadius = 60,
  format = 'number'
}: DistributionPieChartProps) {
  const formatValue = (value: number) => {
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

  const total = data.reduce((sum, entry) => sum + entry.value, 0);

  const renderLabel = (entry: DataPoint) => {
    const percent = ((entry.value / total) * 100).toFixed(0);
    return `${percent}%`;
  };

  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={renderLabel}
          outerRadius={100}
          innerRadius={innerRadius}
          fill="#8884d8"
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={entry.color || SERIES_COLORS[index % SERIES_COLORS.length]}
            />
          ))}
        </Pie>
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
          formatter={(value: number) => formatValue(value)}
        />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}
