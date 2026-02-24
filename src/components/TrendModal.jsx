// src/components/TrendModal.jsx
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useTheme } from '../context/ThemeContext';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';

// Smarter axis formatting
const formatCurrencyForAxis = (value) => {
  if (Math.abs(value) >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
  if (Math.abs(value) >= 1000) return `$${(value / 1000).toFixed(0)}k`;
  return `$${value}`;
};

// Modern Glassmorphism Tooltip
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const dateObj = new Date(label);
    const formattedDate = isNaN(dateObj) ? label : dateObj.toLocaleDateString('en-US', { month: 'short', year: 'numeric', timeZone: 'UTC' });

    return (
      <div className="px-4 py-3 bg-background/90 backdrop-blur-md border border-text/10 rounded-2xl shadow-xl">
        <p className="text-xs font-bold text-text-muted mb-1 uppercase tracking-wider">{formattedDate}</p>
        <p className="text-xl font-extrabold text-primary">
          {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(payload[0].value)}
        </p>
      </div>
    );
  }
  return null;
};

const TrendModal = ({ isOpen, onClose, data, name }) => {
  const { theme } = useTheme();

  const colors = {
    line: theme === 'dark' ? '#22D3EE' : '#0891B2',
    gradientStart: theme === 'dark' ? 'rgba(34, 211, 238, 0.5)' : 'rgba(8, 145, 178, 0.4)',
    gradientEnd: theme === 'dark' ? 'rgba(34, 211, 238, 0)' : 'rgba(8, 145, 178, 0)',
    axisText: theme === 'dark' ? '#8B949E' : '#64748b',
    grid: theme === 'dark' ? 'rgba(139, 148, 158, 0.1)' : 'rgba(100, 116, 139, 0.1)',
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <motion.div 
            initial={{ y: 20, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: -20, opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
            className="relative bg-surface border border-text/5 rounded-3xl shadow-2xl w-full max-w-2xl mx-auto overflow-hidden"
          >
            <div className="flex justify-between items-center p-6 border-b border-text/5">
              <div>
                <p className="text-sm font-semibold text-text-muted mb-1">Historical Trend</p>
                <h2 className="text-2xl font-bold text-text">{name}</h2>
              </div>
              <button onClick={onClose} className="p-2 bg-text/5 rounded-xl text-text-muted hover:text-primary hover:bg-primary/10 transition-colors" aria-label="Close">
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6 w-full h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={colors.gradientStart} />
                      <stop offset="95%" stopColor={colors.gradientEnd} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="date" stroke={colors.axisText} fontSize={12} fontWeight={500} tickLine={false} axisLine={false} tickMargin={12} minTickGap={30} />
                  <YAxis tickFormatter={formatCurrencyForAxis} stroke={colors.axisText} fontSize={12} fontWeight={500} tickLine={false} axisLine={false} tickMargin={12} width={60} />
                  <CartesianGrid stroke={colors.grid} strokeDasharray="4 4" vertical={false} />
                  <Tooltip content={<CustomTooltip />} cursor={{ stroke: colors.axisText, strokeWidth: 1, strokeDasharray: '4 4' }} />
                  <Area 
                    type="monotone" 
                    dataKey="value" 
                    stroke={colors.line} 
                    strokeWidth={3} 
                    fillOpacity={1} 
                    fill="url(#trendGradient)"
                    activeDot={{ r: 6, stroke: colors.line, fill: theme === 'dark' ? '#0d1117' : '#ffffff', strokeWidth: 3, style: { filter: `drop-shadow(0px 0px 4px ${colors.line})` } }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default TrendModal;