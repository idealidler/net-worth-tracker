// src/components/InsightsTab.jsx
import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  RocketLaunchIcon, 
  ChartPieIcon, 
  ChartBarIcon, 
  TrophyIcon,
  ShieldCheckIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

const formatCurrency = (value) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);

const formatPercent = (value) => {
  if (isNaN(value) || value === null) return '0.00%';
  return `${value > 0 ? '+' : ''}${value.toFixed(2)}%`;
};

const InsightsTab = ({ snapshots, goals }) => {
  const metrics = useMemo(() => {
    try {
      if (!snapshots || !Array.isArray(snapshots) || snapshots.length === 0) return null;

      const getTotals = (snap) => {
        let assets = 0, liabilities = 0;
        if (!snap || !snap.categories) return { assets, liabilities, netWorth: 0 };

        snap.categories.forEach(cat => {
          if (!cat.subcategories) return;
          const catTotal = cat.subcategories.reduce((sum, sub) => sum + Math.abs(Number(sub.value) || 0), 0);
          if (cat.type === 'asset') assets += catTotal;
          else liabilities += catTotal;
        });
        return { assets, liabilities, netWorth: assets + liabilities };
      };

      const current = getTotals(snapshots[0]);
      
      const leverageRatio = current.assets > 0 ? (current.liabilities / current.assets) * 100 : 0;

      if (snapshots.length < 2) {
        return {
          leverageRatio,
          velocity: 0,
          cagr: 0,
          fireRunway: null,
          insufficientData: true
        };
      }

      const previous = getTotals(snapshots[1]);
      const oldest = getTotals(snapshots[snapshots.length - 1]);

      const nwDelta = current.netWorth - previous.netWorth;
      const velocity = previous.netWorth !== 0 ? (nwDelta / Math.abs(previous.netWorth)) * 100 : 0;

      const totalGrowth = current.netWorth - oldest.netWorth;
      const roi = oldest.netWorth !== 0 ? (totalGrowth / Math.abs(oldest.netWorth)) * 100 : 0;

      let fireRunwayMonths = null;
      let targetGoal = null;
      
      if (goals && Array.isArray(goals) && goals.length > 0) {
        const topGoal = [...goals].sort((a, b) => (b.targetAmount || 0) - (a.targetAmount || 0))[0];
        targetGoal = topGoal;
        
        const averageDelta = totalGrowth / (snapshots.length - 1);
        
        if (averageDelta > 0 && current.netWorth < topGoal.targetAmount) {
          const remainingDistance = topGoal.targetAmount - current.netWorth;
          fireRunwayMonths = Math.ceil(remainingDistance / averageDelta);
        }
      }

      return {
        current,
        leverageRatio,
        velocity,
        nwDelta,
        roi,
        totalGrowth,
        fireRunwayMonths,
        targetGoal,
        insufficientData: false
      };
    } catch (err) {
      console.error("Insights Engine Error:", err);
      return { hasError: true };
    }
  }, [snapshots, goals]);

  if (!metrics) return null;

  if (metrics.hasError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] border border-accent-red/20 rounded-3xl bg-accent-red/5 p-8 text-center">
        <XMarkIcon className="w-12 h-12 text-accent-red mb-4" />
        <h3 className="text-xl font-bold text-text mb-2">Analytics Engine Error</h3>
        <p className="text-text-muted">There was a mathematical error processing your ledger data. Please check the browser console for details.</p>
      </div>
    );
  }

  if (metrics.insufficientData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] border-2 border-dashed border-text/10 rounded-3xl bg-surface/50 text-center p-8">
        <ChartBarIcon className="w-12 h-12 text-text-muted/40 mb-4" />
        <h3 className="text-xl font-bold text-text mb-2">More Data Required</h3>
        <p className="text-text-muted max-w-md leading-relaxed">
          Advanced analytics require at least two historical snapshots to calculate velocity, leverage, and predictive modeling. Log another snapshot to unlock this engine.
        </p>
      </div>
    );
  }

  const insightCards = [
    {
      title: "Net Worth Velocity",
      subtitle: "Recent Period Growth",
      icon: RocketLaunchIcon,
      value: formatPercent(metrics.velocity),
      subtext: `${metrics.nwDelta >= 0 ? '+' : ''}${formatCurrency(metrics.nwDelta)} since last snapshot`,
      definition: "Measures the rate of change in your wealth between your two most recent snapshots. Positive velocity means you are successfully accumulating value.",
      isPositive: metrics.velocity >= 0,
      TrendIcon: metrics.velocity >= 0 ? ChartBarIcon : ChartPieIcon
    },
    {
      title: "Debt-to-Asset Leverage",
      subtitle: "Risk & Exposure",
      icon: ChartPieIcon,
      value: `${metrics.leverageRatio.toFixed(1)}%`,
      subtext: metrics.leverageRatio > 40 ? "High leverage exposure" : "Healthy leverage ratio",
      definition: "The percentage of your total assets financed by debt. Lower percentages indicate stronger financial resilience against market shocks.",
      isPositive: metrics.leverageRatio < 40,
      TrendIcon: metrics.leverageRatio > 40 ? XMarkIcon : ShieldCheckIcon
    },
    {
      title: "Total Tracked ROI",
      subtitle: "Historical Performance",
      icon: ChartBarIcon,
      value: formatPercent(metrics.roi),
      subtext: `${metrics.totalGrowth >= 0 ? '+' : ''}${formatCurrency(metrics.totalGrowth)} total wealth generated`,
      definition: "The absolute growth rate of your net worth since your very first logged snapshot. Tracks your long-term compounding efficiency.",
      isPositive: metrics.roi >= 0,
      TrendIcon: metrics.roi >= 0 ? ChartBarIcon : ChartPieIcon
    }
  ];

  return (
    <div className="space-y-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-text mb-2">Advanced Analytics</h2>
        <p className="text-sm text-text-muted">Mathematical modeling of your wealth trajectory and capital efficiency.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {insightCards.map((card, index) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            className="premium-card relative overflow-hidden group flex flex-col"
          >
            <div className="flex justify-between items-start mb-6">
              <div className={`p-3 rounded-2xl ${card.isPositive ? 'bg-accent-green/10 text-accent-green' : 'bg-accent-red/10 text-accent-red'}`}>
                <card.icon className="w-6 h-6" />
              </div>
              <card.TrendIcon className={`w-5 h-5 ${card.isPositive ? 'text-accent-green' : 'text-accent-red'} opacity-50`} />
            </div>
            
            <h3 className="text-sm font-bold text-text-muted uppercase tracking-wider mb-1">{card.title}</h3>
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-3xl font-mono font-extrabold text-text tracking-tight">{card.value}</span>
            </div>
            
            <div className="mt-auto border-t border-text/5 pt-4 space-y-2">
              <p className="text-sm font-bold text-text">
                {card.subtext}
              </p>
              <div className="text-xs text-text-muted leading-relaxed">
                <span className="font-bold text-[10px] uppercase tracking-widest opacity-60 block mb-0.5">What this means</span>
                {card.definition}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* FIRE Runway Section */}
      {metrics.targetGoal && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="bg-primary/5 border border-primary/20 rounded-3xl p-8 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 mt-8"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
          
          <div className="flex-1 relative z-10">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-primary/20 rounded-xl"><TrophyIcon className="w-5 h-5 text-primary" /></div>
              <h3 className="text-xl font-bold text-text">FIRE Predictive Runway</h3>
            </div>
            <p className="text-text-muted leading-relaxed mb-3">
              Based on your historical average trajectory, this is the estimated timeline to reach your highest financial target: <strong className="text-text">{metrics.targetGoal.name}</strong>.
            </p>
            <p className="text-xs text-text-muted/70 leading-relaxed border-t border-primary/10 pt-3">
              <span className="font-bold text-[10px] uppercase tracking-widest opacity-60 block mb-0.5">How this is calculated</span>
              This model calculates your average wealth accumulation across all historical snapshots and projects it forward against the remaining distance to your target goal.
            </p>
          </div>

          <div className="shrink-0 relative z-10 text-center md:text-right">
            {metrics.fireRunwayMonths ? (
              <>
                <div className="text-4xl font-mono font-extrabold text-primary mb-1">
                  {Math.floor(metrics.fireRunwayMonths / 12)} <span className="text-xl text-primary/70">yrs</span> {metrics.fireRunwayMonths % 12} <span className="text-xl text-primary/70">mos</span>
                </div>
                <p className="text-sm font-bold text-text-muted uppercase tracking-widest">Estimated Time To Goal</p>
              </>
            ) : (
              <div className="text-xl font-bold text-accent-green">Goal Reached! 🚀</div>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default InsightsTab;