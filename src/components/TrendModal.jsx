// src/components/TrendModal.jsx
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useTheme } from '../context/ThemeContext';
import { XMarkIcon } from '@heroicons/react/24/outline'; // Import the X icon

// We will use a regular Modal component, but add a close button inside this component
// instead of relying on the Modal's default close mechanism for the chart
// import Modal from './Modal'; // No longer needed directly, we'll build the modal content here

const formatCurrency = (value) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
const formatCurrencyForAxis = (value) => `$${(value / 1000).toFixed(0)}k`;

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-3 bg-surface/80 backdrop-blur-sm border border-text/10 rounded-lg shadow-lg">
        <p className="text-sm text-text-muted">{`${label}`}</p>
        <p className="font-bold text-primary-dark dark:text-primary">{formatCurrency(payload[0].value)}</p>
      </div>
    );
  }
  return null;
};

const TrendModal = ({ isOpen, onClose, data, name }) => {
  const { theme } = useTheme();

  // Define theme-aware colors for all chart elements
  const colors = {
    // Light mode adjustments
    line: theme === 'dark' ? '#22D3EE' : '#0891B2', // Cyan for dark, a darker teal for light
    gradientStart: theme === 'dark' ? 'rgba(34, 211, 238, 0.4)' : 'rgba(8, 145, 178, 0.2)', // Slightly less opaque for light
    gradientEnd: theme === 'dark' ? 'rgba(13, 17, 23, 0.1)' : 'rgba(255, 255, 255, 0)', // More transparent for light background
    axisText: theme === 'dark' ? '#8B949E' : '#475569', // Darker gray for light mode text
    grid: theme === 'dark' ? 'rgba(139, 148, 158, 0.1)' : 'rgba(71, 85, 105, 0.08)', // Lighter grid for light mode
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="relative bg-surface border border-text/10 rounded-xl shadow-2xl w-full max-w-2xl mx-auto p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-text">{`Historical Trend for ${name}`}</h2>
          <button onClick={onClose} className="p-2 rounded-full text-text-muted hover:bg-text/10 hover:text-text transition-colors" aria-label="Close">
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>
        <div className="w-full h-80 pr-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
              <defs>
                <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={colors.gradientStart} stopOpacity={0.8}/>
                  <stop offset="95%" stopColor={colors.gradientEnd} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="date" stroke={colors.axisText} fontSize={12} tickLine={false} axisLine={false} />
              <YAxis tickFormatter={formatCurrencyForAxis} stroke={colors.axisText} fontSize={12} tickLine={false} axisLine={false} />
              <CartesianGrid stroke={colors.grid} strokeDasharray="4 4" />
              <Tooltip content={<CustomTooltip />} />
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke={colors.line} 
                strokeWidth={2} 
                fillOpacity={1} 
                fill="url(#trendGradient)"
                activeDot={{ r: 6, stroke: colors.line, fill: 'var(--color-background)', strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default TrendModal;