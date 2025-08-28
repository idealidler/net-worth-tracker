// src/components/BiggestMoversChart.jsx
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useTheme } from '../context/ThemeContext';

const formatCurrencyForAxis = (value) => `$${value.toLocaleString()}`;

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const change = payload[0].value;
    const colorClass = change >= 0 ? 'text-accent-green' : 'text-accent-red';
    return (
      <div className="p-2 bg-surface/80 backdrop-blur-sm border border-text/10 rounded-lg">
        <p className={`font-bold ${colorClass}`}>
          {change >= 0 ? '+' : ''}{formatCurrencyForAxis(change)}
        </p>
      </div>
    );
  }
  return null;
};

const BiggestMoversChart = ({ data }) => {
  const { theme } = useTheme();
  const axisTextColor = theme === 'dark' ? '#8B949E' : '#475569';

  return (
    <div className="bg-surface border border-text/10 p-4 rounded-xl shadow-lg h-96">
      <h3 className="font-bold text-text mb-4">Top 5 Biggest Movers</h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          layout="vertical"
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 20 }}
        >
          <CartesianGrid stroke="var(--color-text-muted)" strokeOpacity={0.1} />
          <XAxis 
            type="number" 
            stroke={axisTextColor} 
            fontSize={12} 
            tickFormatter={formatCurrencyForAxis} 
          />
          <YAxis 
            type="category" 
            dataKey="name" 
            width={100} 
            stroke={axisTextColor} 
            fontSize={12} 
            tickLine={false}
          />
          <Tooltip cursor={{ fill: 'rgba(139, 148, 158, 0.1)' }} content={<CustomTooltip />} />
          <Bar dataKey="change" barSize={20}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.change >= 0 ? '#34D399' : '#F87171'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BiggestMoversChart;