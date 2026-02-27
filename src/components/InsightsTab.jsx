// src/components/InsightsTab.jsx
import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  RocketLaunchIcon, 
  ChartPieIcon, 
  ChartBarIcon, 
  TrophyIcon,
  ShieldCheckIcon,
  XMarkIcon,
  CalendarDaysIcon,
  BanknotesIcon,
  ArrowTrendingUpIcon
} from '@heroicons/react/24/outline';

const formatCurrency = (value) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);

const formatPercent = (value) => {
  if (isNaN(value) || value === null || !isFinite(value)) return '0.00%';
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
        return { assets, liabilities, netWorth: assets - liabilities };
      };

      const current = getTotals(snapshots[0]);
      const leverageRatio = current.assets > 0 ? (current.liabilities / current.assets) * 100 : 0;

      if (snapshots.length < 2) {
        return { leverageRatio, insufficientData: true };
      }

      const previous = getTotals(snapshots[1]);
      const oldest = getTotals(snapshots[snapshots.length - 1]);

      const nwDelta = current.netWorth - previous.netWorth;
      const velocity = previous.netWorth !== 0 ? (nwDelta / Math.abs(previous.netWorth)) * 100 : 0;

      const totalGrowth = current.netWorth - oldest.netWorth;
      const allTimeGrowthRate = oldest.netWorth !== 0 ? (totalGrowth / Math.abs(oldest.netWorth)) * 100 : 0;

      // --- TIME INTELLIGENCE ENGINE ---
      const currentDateObj = new Date(snapshots[0].date);
      const oldestDateObj = new Date(snapshots[snapshots.length - 1].date);
      const totalDaysElapsed = Math.max(1, (currentDateObj - oldestDateObj) / (1000 * 60 * 60 * 24));
      
      const averageDailyGrowth = totalGrowth / totalDaysElapsed;
      const averageMonthlyGrowth = averageDailyGrowth * 30.4375; // Average days in a month

      // 1. CAGR (Compound Annual Growth Rate)
      let cagr = null;
      // CAGR requires a positive starting base. If starting net worth was negative, it is mathematically undefined.
      if (oldest.netWorth > 0 && current.netWorth > 0) {
        const yearsElapsed = totalDaysElapsed / 365.25;
        if (yearsElapsed > 0) {
          cagr = (Math.pow(current.netWorth / oldest.netWorth, 1 / yearsElapsed) - 1) * 100;
        }
      }

      // 2. Year-to-Date (YTD) Growth
      const currentYear = currentDateObj.getFullYear();
      // Snapshots are sorted newest first, so the LAST snapshot of the current year is our YTD baseline
      const ytdSnapshots = snapshots.filter(s => new Date(s.date).getFullYear() === currentYear);
      let ytdGrowth = 0;
      let ytdGrowthRate = 0;
      
      if (ytdSnapshots.length > 0) {
        const oldestYtdSnap = ytdSnapshots[ytdSnapshots.length - 1];
        const ytdTotals = getTotals(oldestYtdSnap);
        ytdGrowth = current.netWorth - ytdTotals.netWorth;
        ytdGrowthRate = ytdTotals.netWorth !== 0 ? (ytdGrowth / Math.abs(ytdTotals.netWorth)) * 100 : 0;
      }

      // --- FIRE RUNWAY ---
      let fireRunwayMonths = null;
      let targetGoal = null;
      let isGoalMet = false;
      let hasPositiveGrowth = false;
      
      if (goals && Array.isArray(goals) && goals.length > 0) {
        const topGoal = [...goals].sort((a, b) => (b.targetAmount || 0) - (a.targetAmount || 0))[0];
        targetGoal = topGoal;
        const currentProgress = topGoal.isNetWorthLinked ? current.netWorth : (topGoal.currentAmount || 0);
        isGoalMet = currentProgress >= topGoal.targetAmount;
        
        if (!isGoalMet) {
          if (averageMonthlyGrowth > 0) {
            hasPositiveGrowth = true;
            const remainingDistance = topGoal.targetAmount - currentProgress;
            fireRunwayMonths = Math.ceil(remainingDistance / averageMonthlyGrowth);
          } else {
            hasPositiveGrowth = false;
          }
        }
      }

      return {
        current,
        leverageRatio,
        velocity,
        nwDelta,
        allTimeGrowthRate,
        totalGrowth,
        averageMonthlyGrowth,
        cagr,
        ytdGrowth,
        ytdGrowthRate,
        fireRunwayMonths,
        targetGoal,
        isGoalMet,
        hasPositiveGrowth,
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
        <p className="text-text-muted">There was a mathematical error processing your ledger data.</p>
      </div>
    );
  }

  if (metrics.insufficientData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] border-2 border-dashed border-text/10 rounded-3xl bg-surface/50 text-center p-8">
        <ChartBarIcon className="w-12 h-12 text-text-muted/40 mb-4" />
        <h3 className="text-xl font-bold text-text mb-2">More Data Required</h3>
        <p className="text-text-muted max-w-md leading-relaxed">
          Advanced time-intelligence requires at least two historical snapshots. Log another snapshot to unlock this engine.
        </p>
      </div>
    );
  }

  // --- STANDARD KPI CARDS ---
  const primaryCards = [
    {
      title: "Net Worth Velocity",
      subtitle: "Recent Period Growth",
      icon: RocketLaunchIcon,
      value: formatPercent(metrics.velocity),
      subtext: `${metrics.nwDelta >= 0 ? '+' : ''}${formatCurrency(metrics.nwDelta)} since last snapshot`,
      definition: "Measures the rate of change between your two most recent snapshots.",
      isPositive: metrics.velocity >= 0,
      TrendIcon: metrics.velocity >= 0 ? ChartBarIcon : ChartPieIcon
    },
    {
      title: "Debt-to-Asset Leverage",
      subtitle: "Risk & Exposure",
      icon: ChartPieIcon,
      value: `${metrics.leverageRatio.toFixed(1)}%`,
      subtext: metrics.leverageRatio > 40 ? "High leverage exposure" : "Healthy leverage ratio",
      definition: "The percentage of your total assets financed by debt. Lower indicates stronger resilience.",
      isPositive: metrics.leverageRatio < 40,
      TrendIcon: metrics.leverageRatio > 40 ? XMarkIcon : ShieldCheckIcon
    },
    {
      title: "All-Time Growth",
      subtitle: "Historical Performance",
      icon: ChartBarIcon,
      value: formatPercent(metrics.allTimeGrowthRate),
      subtext: `${metrics.totalGrowth >= 0 ? '+' : ''}${formatCurrency(metrics.totalGrowth)} total wealth generated`,
      definition: "The absolute growth rate of your net worth since your very first logged snapshot.",
      isPositive: metrics.allTimeGrowthRate >= 0,
      TrendIcon: metrics.allTimeGrowthRate >= 0 ? ChartBarIcon : ChartPieIcon
    }
  ];

  // --- TIME INTELLIGENCE CARDS ---
  const timeIntelligenceCards = [
    {
      title: "True CAGR",
      subtitle: "Annualized Rate",
      icon: ArrowTrendingUpIcon,
      value: metrics.cagr !== null ? formatPercent(metrics.cagr) : 'N/A',
      subtext: metrics.cagr !== null ? "Compound Annual Growth Rate" : "Requires positive starting NW",
      definition: "The theoretical steady growth rate required for your starting net worth to grow to your current net worth in the given time frame.",
      isPositive: metrics.cagr === null || metrics.cagr >= 0,
      TrendIcon: metrics.cagr !== null && metrics.cagr >= 0 ? ChartBarIcon : ChartPieIcon
    },
    {
      title: "YTD Performance",
      subtitle: "Current Calendar Year",
      icon: CalendarDaysIcon,
      value: formatPercent(metrics.ytdGrowthRate),
      subtext: `${metrics.ytdGrowth >= 0 ? '+' : ''}${formatCurrency(metrics.ytdGrowth)} gained this year`,
      definition: "Calculates your net worth growth specifically from the first snapshot logged in the current calendar year to today.",
      isPositive: metrics.ytdGrowthRate >= 0,
      TrendIcon: metrics.ytdGrowthRate >= 0 ? ChartBarIcon : ChartPieIcon
    },
    {
      title: "Accumulation Rate",
      subtitle: "Monthly Average",
      icon: BanknotesIcon,
      value: `${metrics.averageMonthlyGrowth >= 0 ? '+' : ''}${formatCurrency(metrics.averageMonthlyGrowth)}`,
      subtext: "Average wealth generated per 30 days",
      definition: "Your total all-time growth divided by the exact number of months elapsed. Includes both market returns and your active savings.",
      isPositive: metrics.averageMonthlyGrowth >= 0,
      TrendIcon: metrics.averageMonthlyGrowth >= 0 ? ChartBarIcon : ChartPieIcon
    }
  ];

  const renderCard = (card, index) => (
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
        <p className="text-sm font-bold text-text">{card.subtext}</p>
        <div className="text-xs text-text-muted leading-relaxed hidden md:block">
          <span className="font-bold text-[10px] uppercase tracking-widest opacity-60 block mb-0.5">What this means</span>
          {card.definition}
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="space-y-12">
      {/* STANDARD KPIS */}
      <section>
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-text mb-2">Core Metrics</h2>
          <p className="text-sm text-text-muted">Standard snapshot-over-snapshot performance and capital efficiency.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {primaryCards.map((card, index) => renderCard(card, index))}
        </div>
      </section>

      {/* TIME INTELLIGENCE KPIS */}
      <section>
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-text mb-2">Time-Weighted Intelligence</h2>
          <p className="text-sm text-text-muted">Analytics strictly calibrated to the exact dates of your historical snapshots.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {timeIntelligenceCards.map((card, index) => renderCard(card, index + 3))}
        </div>
      </section>

      {/* FIRE Runway Section */}
      {metrics.targetGoal && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="bg-primary/5 border border-primary/20 rounded-3xl p-8 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
          
          <div className="flex-1 relative z-10">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-primary/20 rounded-xl"><TrophyIcon className="w-5 h-5 text-primary" /></div>
              <h3 className="text-xl font-bold text-text">FIRE Predictive Runway</h3>
            </div>
            <p className="text-text-muted leading-relaxed mb-3">
              Based on your time-weighted average trajectory, this is the estimated timeline to reach your highest financial target: <strong className="text-text">{metrics.targetGoal.name}</strong>.
            </p>
          </div>

          <div className="shrink-0 relative z-10 text-center md:text-right">
            {metrics.isGoalMet ? (
              <div className="text-2xl font-bold text-accent-green">Goal Reached! 🚀</div>
            ) : metrics.hasPositiveGrowth && metrics.fireRunwayMonths !== null ? (
              <>
                <div className="text-4xl font-mono font-extrabold text-primary mb-1">
                  {Math.floor(metrics.fireRunwayMonths / 12)} <span className="text-xl text-primary/70">yrs</span> {metrics.fireRunwayMonths % 12} <span className="text-xl text-primary/70">mos</span>
                </div>
                <p className="text-sm font-bold text-text-muted uppercase tracking-widest">Estimated Time To Goal</p>
              </>
            ) : (
              <>
                <div className="text-xl font-bold text-accent-red mb-1">Insufficient Positive Trend</div>
                <p className="text-xs font-bold text-text-muted uppercase tracking-widest mt-1">Requires sustained growth</p>
              </>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default InsightsTab;