// src/components/AllocationChart.jsx
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const COLORS = ['#06B6D4', '#14B8A6', '#6366F1', '#EC4899', '#F97316'];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-2 bg-surface/80 backdrop-blur-sm border border-text/10 rounded-lg">
        <p className="font-bold text-text">{`${payload[0].name}`}</p>
        <p className="text-primary" >{`${(payload[0].value * 100).toFixed(2)}%`}</p>
      </div>
    );
  }
  return null;
};

const AllocationChart = ({ data }) => {
  const assetData = data
    .filter(cat => cat.type === 'asset')
    .map(cat => ({
      name: cat.name,
      value: cat.subcategories.reduce((sum, sub) => sum + sub.value, 0)
    }));

  const totalAssets = assetData.reduce((sum, entry) => sum + entry.value, 0);
  const chartData = assetData.map(entry => ({...entry, value: entry.value / totalAssets }));

  return (
    <div className="h-full w-full flex flex-col justify-center items-center">
      <h3 className="text-text font-bold mb-2">Asset Allocation</h3>
      <ResponsiveContainer width="100%" height={150}>
        <PieChart>
          <Tooltip content={<CustomTooltip />} />
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={40}
            outerRadius={60}
            fill="#8884d8"
            paddingAngle={5}
            dataKey="value"
            nameKey="name"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AllocationChart;