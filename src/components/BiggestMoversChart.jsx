// src/components/BiggestMoversChart.jsx
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useTheme } from '../context/ThemeContext';

// Smarter axis formatting (handles millions cleanly and correctly places the minus sign)
const formatCurrencyForAxis = (value) => {
  const isNegative = value < 0;
  const absVal = Math.abs(value);
  let formatted = absVal;
  
  if (absVal >= 1000000) formatted = `${(absVal / 1000000).toFixed(1)}M`;
  else if (absVal >= 1000) formatted = `${(absVal / 1000).toFixed(0)}k`;
  
  return isNegative ? `-$${formatted}` : `$${formatted}`;
};

// Modern Glassmorphism Tooltip
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const change = payload[0].value;
    const isPositive = change >= 0;
    const colorClass = isPositive ? 'text-accent-green' : 'text-accent-red';
    
    return (
      <div className="px-4 py-3 bg-background/90 backdrop-blur-md border border-text/10 rounded-2xl shadow-xl transform transition-all">
        <p className="text-xs font-bold text-text-muted mb-1 uppercase tracking-wider">{label}</p>
        <p className={`text-xl font-extrabold ${colorClass}`}>
          {isPositive ? '+' : ''}{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(change)}
        </p>
      </div>
    );
  }
  return null;
};

const BiggestMoversChart = ({ data }) => {
  const { theme } = useTheme();

  // Premium theme-aware colors
  const colors = {
    axisText: theme === 'dark' ? '#8B949E' : '#64748b',
    grid: theme === 'dark' ? 'rgba(139, 148, 158, 0.1)' : 'rgba(100, 116, 139, 0.1)',
    cursor: theme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)',
    positive: '#10B981', // Emerald 500
    negative: '#EF4444', // Red 500
  };

  return (
    // Naked, fluid container that perfectly inherits boundaries from Dashboard.jsx
    <div className="w-full h-full min-h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          layout="vertical"
          data={data}
          margin={{ top: 0, right: 30, left: 10, bottom: 0 }}
        >
          {/* horizontal={false} removes horizontal lines, making vertical bar charts much cleaner */}
          <CartesianGrid stroke={colors.grid} strokeDasharray="4 4" horizontal={false} />
          
          <XAxis 
            type="number" 
            stroke={colors.axisText} 
            fontSize={12}
            fontWeight={500}
            tickFormatter={formatCurrencyForAxis} 
            tickLine={false}
            axisLine={false}
          />
          <YAxis 
            type="category" 
            dataKey="name" 
            width={120} // Slightly widened to prevent longer category names from truncating
            stroke={colors.axisText} 
            fontSize={12} 
            fontWeight={500}
            tickLine={false}
            axisLine={false}
            tickMargin={12}
          />
          
          <Tooltip 
            cursor={{ fill: colors.cursor }} 
            content={<CustomTooltip />} 
          />
          
          <Bar dataKey="change" barSize={24} radius={6}>
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={entry.change >= 0 ? colors.positive : colors.negative} 
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BiggestMoversChart;