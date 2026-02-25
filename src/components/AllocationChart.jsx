// src/components/AllocationChart.jsx
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { useTheme } from '../context/ThemeContext';

// Replace the old COLORS array with this one:
const COLORS = [
  '#6366F1', // Indigo
  '#14B8A6', // Teal
  '#8B5CF6', // Violet
  '#F59E0B', // Amber
  '#F43F5E', // Rose
  '#0EA5E9'  // Sky
];

const formatCurrency = (value) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);

// Modern Glassmorphism Tooltip
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="px-4 py-3 bg-background/90 backdrop-blur-md border border-text/10 rounded-2xl shadow-xl">
        <p className="text-xs font-bold text-text-muted mb-1 uppercase tracking-wider">{payload[0].name}</p>
        <p className="text-xl font-extrabold" style={{ color: payload[0].payload.fill }}>
          {formatCurrency(payload[0].value)}
        </p>
        <p className="text-sm font-semibold text-text mt-1">
          {payload[0].payload.percentage.toFixed(1)}% of Assets
        </p>
      </div>
    );
  }
  return null;
};

const AllocationChart = ({ data }) => {
  const { theme } = useTheme();

  const assetData = data
    .filter(cat => cat.type === 'asset')
    .map(cat => ({
      name: cat.name,
      value: cat.subcategories.reduce((sum, sub) => sum + sub.value, 0)
    }))
    .filter(cat => cat.value > 0);

  const totalAssets = assetData.reduce((sum, entry) => sum + entry.value, 0);
  
  const chartData = assetData
    .map((entry, index) => ({
      ...entry, 
      percentage: (entry.value / totalAssets) * 100,
      fill: COLORS[index % COLORS.length]
    }))
    .sort((a, b) => b.value - a.value);

  if (totalAssets === 0) {
    return (
      <div className="flex h-full w-full items-center justify-center text-text-muted text-sm font-medium italic">
        No assets available for allocation.
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col relative">
      {/* 1. The Donut Chart */}
      <div className="h-[220px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Tooltip content={<CustomTooltip />} />
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius="65%"
              outerRadius="90%"
              paddingAngle={4}
              dataKey="value"
              nameKey="name"
              stroke="none"
              cornerRadius={6}
            >
              {chartData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.fill} 
                  stroke={theme === 'dark' ? '#161B22' : '#f8fafc'} // Matches the surface color to hide seams
                  strokeWidth={3}
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* 2. The Custom Data Legend */}
      <div className="mt-6 flex-1 overflow-y-auto pr-2 custom-scrollbar">
        <div className="space-y-3">
          {chartData.map((item, index) => (
            <div key={index} className="flex items-center justify-between text-sm group">
              <div className="flex items-center gap-3 overflow-hidden">
                {/* Color Dot */}
                <div 
                  className="w-3 h-3 rounded-full flex-shrink-0 shadow-sm" 
                  style={{ backgroundColor: item.fill }}
                />
                {/* Category Name */}
                <span className="font-semibold text-text-muted group-hover:text-text transition-colors truncate">
                  {item.name}
                </span>
              </div>
              
              {/* Values */}
              <div className="flex items-center gap-4 flex-shrink-0 ml-4">
                <span className="font-mono font-medium text-text">
                  {formatCurrency(item.value)}
                </span>
                <span className="font-mono font-bold w-12 text-right" style={{ color: item.fill }}>
                  {item.percentage.toFixed(1)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AllocationChart;