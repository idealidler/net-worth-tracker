// src/components/PaydayWidget.jsx
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CalendarDaysIcon, 
  BoltIcon, 
  XMarkIcon,
  CheckCircleIcon,
  Cog6ToothIcon,
  BanknotesIcon
} from '@heroicons/react/24/outline';

const PAY_SCHEDULES = [
  { id: 'biweekly', label: 'Bi-Weekly', sub: 'Every 14 days' },
  { id: 'semimonthly_1_15', label: 'Semi-Monthly', sub: '1st & 15th' },
  { id: 'semimonthly_15_end', label: 'Semi-Monthly', sub: '15th & Last Day' },
  { id: 'monthly_1st', label: 'Monthly', sub: '1st of the month' }
];

const PaydayWidget = () => {
  const [config, setConfig] = useState(() => {
    const saved = localStorage.getItem('paydayConfig');
    return saved ? JSON.parse(saved) : null;
  });
  
  const [isConfiguring, setIsConfiguring] = useState(false);
  const [declined, setDeclined] = useState(() => localStorage.getItem('paydayDeclined') === 'true');
  
  const [scheduleType, setScheduleType] = useState(config?.type || null);
  const [lastPayDate, setLastPayDate] = useState(config?.anchorDate || '');

  // Timezone-safe local date string generator to prevent selecting future anchor dates
  const getLocalDateString = () => {
    const d = new Date();
    return new Date(d.getTime() - (d.getTimezoneOffset() * 60000)).toISOString().split('T')[0];
  };

  // --- THE TIME INTELLIGENCE ENGINE ---
  const daysUntilPayday = useMemo(() => {
    if (!config) return null;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let nextPayday = new Date();
    nextPayday.setHours(0, 0, 0, 0);

    if (config.type === 'semimonthly_1_15') {
      const day = today.getDate();
      if (day < 15) {
        nextPayday.setDate(15);
      } else {
        nextPayday.setMonth(today.getMonth() + 1);
        nextPayday.setDate(1);
      }
    } 
    else if (config.type === 'semimonthly_15_end') {
      const day = today.getDate();
      if (day < 15) {
        nextPayday.setDate(15);
      } else {
        nextPayday = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      }
    }
    else if (config.type === 'monthly_1st') {
      nextPayday.setMonth(today.getMonth() + 1);
      nextPayday.setDate(1);
    }
    else if (config.type === 'biweekly' && config.anchorDate) {
      const anchor = new Date(config.anchorDate);
      anchor.setHours(0, 0, 0, 0);
      
      nextPayday = new Date(anchor.getTime());
      nextPayday.setMinutes(nextPayday.getMinutes() + nextPayday.getTimezoneOffset());
      
      while (nextPayday < today) {
        nextPayday.setDate(nextPayday.getDate() + 14);
      }
    }

    const diffTime = nextPayday.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }, [config]);

  const handleSave = () => {
    if (!scheduleType) return;
    const newConfig = { type: scheduleType, anchorDate: lastPayDate };
    setConfig(newConfig);
    setDeclined(false);
    localStorage.setItem('paydayConfig', JSON.stringify(newConfig));
    localStorage.removeItem('paydayDeclined');
    setIsConfiguring(false);
  };

  const handleDecline = () => {
    setDeclined(true);
    localStorage.setItem('paydayDeclined', 'true');
    setIsConfiguring(false);
  };

  const handleRestore = () => {
    setDeclined(false);
    setIsConfiguring(true);
    localStorage.removeItem('paydayDeclined');
  };

  if (declined && !isConfiguring) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-end">
        <button 
          onClick={handleRestore} 
          className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface border border-text/5 text-xs font-bold text-text-muted hover:text-primary hover:border-primary/20 hover:bg-primary/5 transition-all shadow-sm group"
        >
          <BoltIcon className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" /> 
          Enable Payday Sync
        </button>
      </motion.div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      {/* STATE 1: Configured & Tracking */}
      {config && !isConfiguring && (
        <motion.div
          key="tracking"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="premium-card bg-gradient-to-br from-surface to-primary/5 border border-primary/20 relative overflow-hidden group"
        >
          <div className="flex justify-between items-center relative z-10">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-2xl ${daysUntilPayday === 0 ? 'bg-accent-green/20 text-accent-green shadow-[0_0_15px_rgba(var(--color-accent-green),0.2)]' : 'bg-primary/10 text-primary'}`}>
                {daysUntilPayday === 0 ? <CheckCircleIcon className="w-6 h-6 animate-pulse" /> : <BanknotesIcon className="w-6 h-6" />}
              </div>
              <div>
                {/* UPGRADED: Celebratory SaaS Copy */}
                <h3 className="text-lg font-bold text-text mb-0.5">
                  {daysUntilPayday === 0 
                    ? "Yayyy! Your paycheck came in today! 🎉" 
                    : daysUntilPayday === 1 
                      ? "Payday is tomorrow!" 
                      : `Payday in ${daysUntilPayday} days`}
                </h3>
                <p className="text-sm text-text-muted">
                  {daysUntilPayday === 0 
                    ? "Let's crunch those numbers to see your progress." 
                    : "Prepare to log your next financial snapshot."}
                </p>
              </div>
            </div>
            
            <button 
              onClick={() => setIsConfiguring(true)}
              className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-text-muted hover:text-primary transition-colors px-3 py-2 bg-text/5 hover:bg-primary/10 rounded-xl opacity-60 hover:opacity-100"
            >
              <Cog6ToothIcon className="w-4 h-4" /> Edit
            </button>
          </div>
          
          {daysUntilPayday !== null && daysUntilPayday > 0 && (
            <div className="absolute bottom-0 left-0 h-1 bg-primary/10 w-full">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${Math.max(5, 100 - (daysUntilPayday / 15) * 100)}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="h-full bg-primary"
              />
            </div>
          )}
        </motion.div>
      )}

      {/* STATE 2: The Setup / Questionnaire */}
      {(!config || isConfiguring) && !declined && (
        <motion.div
          key="setup"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          className="premium-card border border-primary/20 bg-surface shadow-xl relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

          <button onClick={handleDecline} className="absolute top-5 right-5 p-1.5 text-text-muted hover:bg-accent-red/10 hover:text-accent-red rounded-lg transition-colors z-20">
            <XMarkIcon className="w-5 h-5" />
          </button>

          <div className="flex items-start gap-4 mb-8 relative z-10 pr-8">
            <div className="p-3 bg-primary/10 rounded-2xl shrink-0 border border-primary/20 shadow-inner">
              <BoltIcon className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-text mb-1">Automate your habits</h3>
              <p className="text-sm text-text-muted leading-relaxed">
                Users who update their ledger on regular basis build wealth <span className="text-primary font-bold">2x faster</span>. Tell us your pay schedule, and the engine will calculate the perfect time for your next snapshot. 
              </p>
            </div>
          </div>

          <div className="space-y-6 relative z-10">
            <div>
              <label className="block text-xs font-bold text-text-muted uppercase tracking-widest mb-3">Select your pay cycle</label>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {PAY_SCHEDULES.map((schedule) => {
                  const isSelected = scheduleType === schedule.id;
                  return (
                    <button
                      key={schedule.id}
                      onClick={() => setScheduleType(schedule.id)}
                      className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all duration-200 focus:outline-none ${
                        isSelected 
                          ? 'border-primary bg-primary/5 text-primary shadow-[0_0_20px_rgba(var(--color-primary),0.1)] scale-[1.02]' 
                          : 'border-text/5 bg-background text-text-muted hover:border-text/15 hover:bg-text/[0.02]'
                      }`}
                    >
                      <span className={`font-bold text-sm mb-1 ${isSelected ? 'text-primary' : 'text-text'}`}>{schedule.label}</span>
                      <span className="text-[10px] font-bold uppercase tracking-wider opacity-60 text-center">{schedule.sub}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <AnimatePresence>
              {scheduleType === 'biweekly' && (
                <motion.div 
                  initial={{ opacity: 0, height: 0, marginTop: 0 }} 
                  animate={{ opacity: 1, height: 'auto', marginTop: 24 }} 
                  exit={{ opacity: 0, height: 0, marginTop: 0 }}
                  className="overflow-hidden"
                >
                  <div className="bg-background border border-text/5 p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                    <div className="flex-1">
                      <label className="flex items-center gap-2 text-sm font-bold text-text mb-1">
                        <CalendarDaysIcon className="w-5 h-5 text-primary" /> Anchor Date
                      </label>
                      <p className="text-xs text-text-muted">When was your last paycheck?</p>
                    </div>
                    
                    {/* UPGRADED: Sleek, minimalist date picker without the extra pill buttons */}
                    <div className="relative w-full sm:w-64 group">
                      <div className="flex items-center justify-between w-full bg-surface border border-text/10 rounded-xl px-4 py-3 text-sm font-semibold transition-all group-hover:border-primary/40 group-focus-within:border-primary group-focus-within:ring-4 group-focus-within:ring-primary/10 shadow-sm cursor-pointer">
                        <span className={lastPayDate ? 'text-text' : 'text-text-muted'}>
                          {lastPayDate 
                            ? new Date(lastPayDate + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) 
                            : 'Select date...'}
                        </span>
                        <CalendarDaysIcon className="w-5 h-5 text-primary opacity-80" />
                      </div>
                      
                      <input 
                        type="date" 
                        value={lastPayDate}
                        max={getLocalDateString()}
                        onChange={(e) => {
                          setLastPayDate(e.target.value);
                          e.target.blur(); // Forces the native calendar to close on selection
                        }}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                    </div>

                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="flex items-center justify-between mt-8 relative z-10 pt-6 border-t border-text/5">
            <span className="text-xs font-bold text-text-muted opacity-50 italic hidden sm:block">Stored locally. Never shared.</span>
            <div className="flex gap-3 w-full sm:w-auto justify-end">
              <button onClick={handleDecline} className="px-5 py-2.5 text-sm font-bold text-text-muted hover:text-text hover:bg-text/5 rounded-xl transition-colors">
                Skip
              </button>
              <button 
                onClick={handleSave} 
                disabled={!scheduleType || (scheduleType === 'biweekly' && !lastPayDate)}
                className="px-6 py-2.5 bg-primary text-background text-sm font-bold rounded-xl shadow-lg hover:shadow-primary/30 hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-none transition-all"
              >
                Activate Sync
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PaydayWidget;