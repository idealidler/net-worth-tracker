// src/components/NetWorthChart.jsx
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useTheme } from '../context/ThemeContext'; // 1. Import and use the theme context

const formatCurrencyForAxis = (value) => `$${(value / 1000).toFixed(0)}k`;

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-3 bg-surface/80 dark:bg-surface/80 backdrop-blur-sm border border-text/10 rounded-lg shadow-lg">
        <p className="text-sm text-text-muted">{`${label}`}</p>
        <p className="font-bold text-primary-dark dark:text-primary">{`${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(payload[0].value)}`}</p>
      </div>
    );
  }
  return null;
};

const NetWorthChart = ({ data }) => {
  // 2. Get the current theme to define dynamic colors
  const { theme } = useTheme();

  // 3. Define theme-aware colors for all chart elements
  const colors = {
    line: theme === 'dark' ? '#22D3EE' : '#0891B2', // primary vs. a darker cyan
    gradientStart: theme === 'dark' ? 'rgba(34, 211, 238, 0.4)' : 'rgba(8, 145, 178, 0.3)',
    gradientEnd: theme === 'dark' ? 'rgba(13, 17, 23, 0.1)' : 'rgba(255, 255, 255, 0.1)',
    axisText: theme === 'dark' ? '#8B949E' : '#475569',
    grid: theme === 'dark' ? 'rgba(139, 148, 158, 0.1)' : 'rgba(71, 85, 105, 0.1)',
  };

  const chartData = data.map(entry => {
    const totalAssets = entry.categories
      .filter(c => c.type === 'asset')
      .reduce((sum, cat) => sum + cat.subcategories.reduce((subSum, sub) => subSum + sub.value, 0), 0);
    const totalLiabilities = entry.categories
      .filter(c => c.type === 'liability')
      .reduce((sum, cat) => sum + cat.subcategories.reduce((subSum, sub) => subSum + sub.value, 0), 0);
    return {
      date: entry.date,
      'Net Worth': totalAssets + totalLiabilities,
    };
  }).reverse();

  return (
    <div className="bg-surface border border-text/10 p-4 rounded-xl shadow-lg h-80">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={chartData}
          margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
        >
          <defs>
            <linearGradient id="colorNetWorth" x1="0" y1="0" x2="0" y2="1">
              {/* 4. Use dynamic gradient colors */}
              <stop offset="5%" stopColor={colors.gradientStart} stopOpacity={0.8}/>
              <stop offset="95%" stopColor={colors.gradientEnd} stopOpacity={0}/>
            </linearGradient>
          </defs>
          
          {/* 5. Update chart components with dynamic colors and cleaner styles */}
          <XAxis 
            dataKey="date" 
            stroke={colors.axisText} 
            fontSize={12} 
            tickLine={false} 
            axisLine={false} 
          />
          <YAxis 
            tickFormatter={formatCurrencyForAxis} 
            stroke={colors.axisText} 
            fontSize={12} 
            tickLine={false} 
            axisLine={false} 
          />
          <CartesianGrid stroke={colors.grid} strokeDasharray="4 4" />
          <Tooltip content={<CustomTooltip />} />
          <Area 
            type="monotone" 
            dataKey="Net Worth" 
            stroke={colors.line} 
            strokeWidth={2} 
            fillOpacity={1} 
            fill="url(#colorNetWorth)"
            activeDot={{ r: 6, stroke: colors.line, fill: 'var(--color-background)', strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default NetWorthChart;