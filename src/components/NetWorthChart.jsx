// src/components/NetWorthChart.jsx
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useTheme } from '../context/ThemeContext';

// Smarter axis formatting (handles millions cleanly)
const formatCurrencyForAxis = (value) => {
  if (Math.abs(value) >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
  if (Math.abs(value) >= 1000) return `$${(value / 1000).toFixed(0)}k`;
  return `$${value}`;
};

// Modern Glassmorphism Tooltip
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    // Attempt to format the date nicely (e.g., "Aug 2025")
    const dateObj = new Date(label);
    const formattedDate = isNaN(dateObj) 
      ? label 
      : dateObj.toLocaleDateString('en-US', { month: 'short', year: 'numeric', timeZone: 'UTC' });

    return (
      <div className="px-4 py-3 bg-background/90 backdrop-blur-md border border-text/10 rounded-2xl shadow-xl transform transition-all">
        <p className="text-xs font-bold text-text-muted mb-1 uppercase tracking-wider">{formattedDate}</p>
        <p className="text-xl font-extrabold text-primary">
          {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(payload[0].value)}
        </p>
      </div>
    );
  }
  return null;
};

const NetWorthChart = ({ data }) => {
  const { theme } = useTheme();

  // Premium theme-aware colors
  const colors = {
    line: theme === 'dark' ? '#22D3EE' : '#0891B2',
    gradientStart: theme === 'dark' ? 'rgba(34, 211, 238, 0.5)' : 'rgba(8, 145, 178, 0.4)',
    gradientEnd: theme === 'dark' ? 'rgba(34, 211, 238, 0)' : 'rgba(8, 145, 178, 0)',
    axisText: theme === 'dark' ? '#8B949E' : '#64748b', // Lighter text for better readability
    grid: theme === 'dark' ? 'rgba(139, 148, 158, 0.1)' : 'rgba(100, 116, 139, 0.1)',
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
      // Note: Liabilities are expected to be negative numbers based on your templateData.js
      'Net Worth': totalAssets + totalLiabilities, 
    };
  }).reverse();

  return (
    // Removed the background, border, and padding here so it inherits perfectly from Dashboard.jsx
    <div className="w-full h-full min-h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={chartData}
          margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorNetWorth" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={colors.gradientStart} />
              <stop offset="95%" stopColor={colors.gradientEnd} />
            </linearGradient>
          </defs>
          
          <XAxis 
            dataKey="date" 
            stroke={colors.axisText} 
            fontSize={12} 
            fontWeight={500}
            tickLine={false} 
            axisLine={false} 
            tickMargin={12}
            minTickGap={30}
          />
          <YAxis 
            tickFormatter={formatCurrencyForAxis} 
            stroke={colors.axisText} 
            fontSize={12}
            fontWeight={500}
            tickLine={false} 
            axisLine={false} 
            tickMargin={12}
            width={60} // Ensures larger numbers don't get cut off
          />
          
          {/* vertical={false} removes the vertical grid lines for a cleaner, modern look */}
          <CartesianGrid stroke={colors.grid} strokeDasharray="4 4" vertical={false} />
          
          <Tooltip 
            content={<CustomTooltip />} 
            cursor={{ stroke: colors.axisText, strokeWidth: 1, strokeDasharray: '4 4' }}
          />
          
          <Area 
            type="monotone" 
            dataKey="Net Worth" 
            stroke={colors.line} 
            strokeWidth={3} 
            fillOpacity={1} 
            fill="url(#colorNetWorth)"
            animationDuration={1500}
            activeDot={{ 
              r: 6, 
              stroke: colors.line, 
              fill: theme === 'dark' ? '#0d1117' : '#ffffff', 
              strokeWidth: 3,
              style: { filter: `drop-shadow(0px 0px 4px ${colors.line})` } 
            }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default NetWorthChart;