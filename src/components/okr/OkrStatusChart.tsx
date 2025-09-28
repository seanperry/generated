import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useOkrStore } from '@/lib/store';
import { getObjectiveStatus } from '@/lib/utils';
import { ObjectiveStatus } from '@/types';
const COLORS: Record<ObjectiveStatus, string> = {
  'on-track': '#008765',     // kelly-green
  'at-risk': '#FFC107',      // amber-400
  'off-track': '#FF6A13',   // kelly-orange
  'completed': '#3B82F6',    // blue-500
  'did-not-meet': '#6B7280', // gray-500
};
export const OkrStatusChart: React.FC = () => {
  const okrs = useOkrStore((state) => state.okrs);
  const statusData = okrs.reduce((acc, okr) => {
    const status = getObjectiveStatus(okr);
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const chartData = Object.entries(statusData).map(([name, value]) => ({ name: name.replace('-', ' '), value }));
  if (okrs.length === 0) {
    return (
      <Card className="bg-white dark:bg-kelly-charcoal/90 border-gray-200 dark:border-gray-800 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-kelly-charcoal dark:text-gray-100">OKR Status Overview</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-64">
          <p className="text-gray-500 dark:text-gray-400">No OKR data to display.</p>
        </CardContent>
      </Card>
    );
  }
  return (
    <Card className="bg-white dark:bg-kelly-charcoal/90 border-gray-200 dark:border-gray-800 shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-kelly-charcoal dark:text-gray-100">OKR Status Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              fill="#8884d8"
              paddingAngle={5}
              dataKey="value"
              labelLine={false}
              label={({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
                const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
                const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));
                return (
                  <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" className="text-xs font-bold">
                    {`${(percent * 100).toFixed(0)}%`}
                  </text>
                );
              }}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[entry.name.replace(' ', '-') as keyof typeof COLORS]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                background: 'hsl(var(--background))',
                borderColor: 'hsl(var(--border))',
                borderRadius: 'var(--radius)',
              }}
              formatter={(value, name) => {
                const nameStr = String(name);
                return [`${value} OKR(s)`, nameStr.charAt(0).toUpperCase() + nameStr.slice(1)]
              }}
            />
            <Legend iconType="circle" formatter={(value) => <span className="capitalize">{value}</span>} />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};