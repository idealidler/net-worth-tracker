// src/components/Dashboard.jsx
import React, { useState, useEffect, useMemo, useRef } from 'react';
import Footer from './Footer';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  DocumentPlusIcon, PlusCircleIcon, TrashIcon, 
  ChartPieIcon, BookOpenIcon, ClockIcon, TrophyIcon,
  PencilSquareIcon, HomeIcon, AcademicCapIcon, SparklesIcon, RocketLaunchIcon
} from '@heroicons/react/24/outline';
import { CurrencyDollarIcon, BanknotesIcon, CreditCardIcon } from '@heroicons/react/24/solid';

import { useSnapshots, useUpdateSnapshot, useAddSnapshot, useDeleteSnapshot, useGoals, useAddGoal, useUpdateGoal, useDeleteGoal } from '../hooks/useNetWorth';
import { templateData } from '../data/templateData';
import { useAuth } from '../context/AuthContext';

import Modal from './Modal';
import TrendModal from './TrendModal';
import NetWorthChart from './NetWorthChart';
import AllocationChart from './AllocationChart';
import BiggestMoversChart from './BiggestMoversChart';
import CategoryCard from './CategoryCard';
import ThemeToggle from './ThemeToggle';
import NewSnapshotForm from './forms/NewSnapshotForm';
import GoalForm from './forms/GoalForm';
import AnimatedCounter from './AnimatedCounter';

const formatCurrency = (value) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);

const ICONS = { TrophyIcon, HomeIcon, AcademicCapIcon, SparklesIcon, RocketLaunchIcon, BanknotesIcon };

const Dashboard = ({ userName }) => {
  const { data, isLoading } = useSnapshots();
  const { data: goals } = useGoals();
  const updateSnapshot = useUpdateSnapshot();
  const addSnapshot = useAddSnapshot();
  const deleteSnapshot = useDeleteSnapshot();
  const addGoal = useAddGoal();
  const updateGoal = useUpdateGoal();
  const deleteGoal = useDeleteGoal();
  
  const { logout } = useAuth();
  const isDemo = new URLSearchParams(window.location.search).get('demo') === 'true';

  const [selectedDataIndex, setSelectedDataIndex] = useState(0);
  const [activeTab, setActiveTab] = useState('overview'); 
  const [modalState, setModalState] = useState({ isOpen: false, type: null, data: null });
  const [targetDate, setTargetDate] = useState(null);
  const [trendState, setTrendState] = useState({ isOpen: false, data: [], name: '' });

  const historyScrollRef = useRef(null);

  useEffect(() => {
    if (activeTab === 'history') {
      const scrollDownTimer = setTimeout(() => { if (historyScrollRef.current) historyScrollRef.current.scrollTo({ top: 40, behavior: 'smooth' }); }, 300);
      const scrollUpTimer = setTimeout(() => { if (historyScrollRef.current) historyScrollRef.current.scrollTo({ top: 0, behavior: 'smooth' }); }, 800);
      return () => { clearTimeout(scrollDownTimer); clearTimeout(scrollUpTimer); };
    }
  }, [activeTab]);

  useEffect(() => {
    if (!data) return;
    if (targetDate) {
      const newIndex = data.findIndex(d => d.date === targetDate);
      if (newIndex !== -1) { setSelectedDataIndex(newIndex); setTargetDate(null); setActiveTab('overview'); }
    } else if (selectedDataIndex >= data.length) {
      setSelectedDataIndex(Math.max(0, data.length - 1));
    }
  }, [data, targetDate, selectedDataIndex]);

  const topMovers = useMemo(() => {
    if (!data || data.length < 2 || selectedDataIndex >= data.length - 1) return null;
    const currentSnapshot = data[selectedDataIndex];
    const previousSnapshot = data[selectedDataIndex + 1];
    const allSubcategories = {};
    
    currentSnapshot.categories.forEach(cat => cat.subcategories.forEach(sub => allSubcategories[sub.id] = { name: sub.name, currentValue: sub.value, previousValue: 0 }));
    previousSnapshot.categories.forEach(cat => cat.subcategories.forEach(sub => {
      if (!allSubcategories[sub.id]) allSubcategories[sub.id] = { name: sub.name, currentValue: 0, previousValue: 0 };
      allSubcategories[sub.id].previousValue = sub.value;
    }));
    
    const changes = Object.values(allSubcategories).map(sub => ({ name: sub.name, change: sub.currentValue - sub.previousValue })).filter(sub => sub.change !== 0);
    changes.sort((a, b) => Math.abs(b.change) - Math.abs(a.change));
    return changes.slice(0, 5);
  }, [data, selectedDataIndex]);

  const getSnapshotTotals = (snapshot) => {
    let assets = 0, liabilities = 0;
    snapshot.categories.forEach(cat => {
      const catTotal = cat.subcategories.reduce((sum, sub) => sum + sub.value, 0);
      if (cat.type === 'asset') assets += catTotal;
      else liabilities += catTotal;
    });
    return { assets, liabilities, netWorth: assets + liabilities };
  };

  const handleShowCategoryTrend = (categoryId, categoryName) => {
    const trendData = data.map(snapshot => {
      const category = snapshot.categories.find(c => c.id === categoryId);
      return { date: snapshot.date, value: category ? category.subcategories.reduce((sum, sub) => sum + sub.value, 0) : 0 };
    }).reverse();
    setTrendState({ isOpen: true, data: trendData, name: categoryName });
  };

  const handleShowSubcategoryTrend = (subcategoryId, subcategoryName) => {
    const trendData = data.map(snapshot => {
      let value = 0;
      for (const category of snapshot.categories) {
        const sub = category.subcategories.find(s => s.id === subcategoryId);
        if (sub) { value = sub.value; break; }
      }
      return { date: snapshot.date, value };
    }).reverse();
    setTrendState({ isOpen: true, data: trendData, name: subcategoryName });
  };
  
  const handleDeleteSnapshot = (dateToDelete) => {
    if (data.length <= 1) { alert("You cannot delete your only snapshot."); return; }
    if (window.confirm(`Permanently delete the snapshot for ${dateToDelete}?`)) deleteSnapshot.mutate(dateToDelete, { onSuccess: () => setSelectedDataIndex(0) });
  };

  const handleUpdateCategory = (updatedCategory) => {
    const currentData = data[selectedDataIndex];
    const updatedCategories = currentData.categories.map(c => c.id === updatedCategory.id ? updatedCategory : c);
    updateSnapshot.mutate({ ...currentData, categories: updatedCategories });
  };

  const handleDeleteCategory = (categoryId) => {
    if (window.confirm("Delete this entire category and all its items?")) {
      const currentData = data[selectedDataIndex];
      updateSnapshot.mutate({ ...currentData, categories: currentData.categories.filter(c => c.id !== categoryId) });
    }
  };

  const handleAddNewCategory = (assetType) => {
    const name = window.prompt(`Enter a name for your new ${assetType} category:`);
    if (name && name.trim()) {
      const currentData = data[selectedDataIndex];
      const newCat = { id: `cat_${Date.now()}`, name: name.trim(), type: assetType, subcategories: [] };
      updateSnapshot.mutate({ ...currentData, categories: [...currentData.categories, newCat] });
    }
  };

  const handleNewSnapshotSubmit = (formData) => {
    if (data.findIndex(d => d.date === formData) !== -1) { alert("A snapshot for this date already exists."); return; }
    const newSnapshot = { ...(data.length > 0 ? data[0] : templateData[0]), date: formData };
    addSnapshot.mutate(newSnapshot, { onSuccess: () => setTargetDate(formData) });
    setModalState({ isOpen: false, type: null });
  };

  // --- THE FIX: Intelligent Mutation Handling ---
  const handleGoalSubmit = (goalData) => {
    const onSuccess = () => setModalState({ isOpen: false, type: null });
    const onError = (error) => {
      console.error(error);
      alert(`Failed to save goal: ${error.message}\n\n(If it says "Missing or insufficient permissions", your Firebase Rules are blocking the 'goals' collection!)`);
    };

    if (modalState.type === 'editGoal') {
      updateGoal.mutate(goalData, { onSuccess, onError });
    } else {
      addGoal.mutate(goalData, { onSuccess, onError });
    }
  };

  const handleDeleteGoal = (goalId) => {
    if (window.confirm("Delete this goal?")) deleteGoal.mutate(goalId);
  };

  const handleExit = async () => {
    if (isDemo) window.location.href = '/'; 
    else { try { await logout(); } catch (error) { console.error("Failed to log out", error); } }
  };

  if (isLoading) {
    return (
      <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto space-y-8 animate-pulse">
        <div className="flex justify-between items-center mb-6">
          <div className="space-y-3"><div className="h-8 w-48 bg-text/5 rounded-lg"></div><div className="h-5 w-32 bg-text/5 rounded-lg"></div></div>
          <div className="h-10 w-24 bg-text/5 rounded-xl"></div>
        </div>
        <div className="h-12 w-80 bg-text/5 rounded-2xl mb-8"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => <div key={i} className="premium-card h-28"></div>)}
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 text-center max-w-7xl mx-auto">
        <h1 className="text-4xl font-extrabold text-text mb-2">Welcome, {userName}!</h1>
        <p className="mb-8 text-lg text-text-muted">Your financial journey starts here. Add your first snapshot.</p>
        <button onClick={() => setModalState({ isOpen: true, type: 'newSnapshot' })} className="px-6 py-3 bg-primary text-background font-bold rounded-xl shadow-lg hover:-translate-y-0.5 transition-all flex items-center gap-2">
          <DocumentPlusIcon className="w-6 h-6" /> Add First Snapshot
        </button>
      </div>
    );
  }

  const currentData = data[selectedDataIndex];
  const { assets: totalAssets, liabilities: totalLiabilities, netWorth } = getSnapshotTotals(currentData);

  const stats = [
    { label: 'Total Net Worth', value: netWorth, color: 'text-primary', icon: CurrencyDollarIcon, bg: 'bg-primary/10', iconColor: 'text-primary' },
    { label: 'Total Assets', value: totalAssets, color: 'text-accent-green', icon: BanknotesIcon, bg: 'bg-accent-green/10', iconColor: 'text-accent-green' },
    { label: 'Total Liabilities', value: totalLiabilities, color: 'text-accent-red', icon: CreditCardIcon, bg: 'bg-accent-red/10', iconColor: 'text-accent-red' },
  ];

  const tabs = [
    { id: 'overview', name: 'Overview', icon: ChartPieIcon },
    { id: 'ledger', name: 'The Ledger', icon: BookOpenIcon },
    { id: 'goals', name: 'Goals', icon: TrophyIcon },
    { id: 'history', name: 'History', icon: ClockIcon },
  ];

  return (
    <>
      <Modal isOpen={modalState.isOpen} onClose={() => setModalState({ isOpen: false, type: null })} title={modalState.type === 'newSnapshot' ? "Create Snapshot" : "Financial Goal"}>
        {modalState.type === 'newSnapshot' && <NewSnapshotForm onSubmit={handleNewSnapshotSubmit} onCancel={() => setModalState({ isOpen: false, type: null })} />}
        {(modalState.type === 'newGoal' || modalState.type === 'editGoal') && <GoalForm onSubmit={handleGoalSubmit} initialData={modalState.data} onCancel={() => setModalState({ isOpen: false, type: null })} />}
      </Modal>
      <TrendModal isOpen={trendState.isOpen} onClose={() => setTrendState({ isOpen: false, data: [], name: '' })} data={trendState.data} name={trendState.name} />
      
      <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-6">

        <div className="flex flex-col">
          <h1 className="text-3xl font-extrabold text-text tracking-tight">Statement of Financial Position</h1>
          <div className="flex items-center gap-3 mt-2">
            <span className="text-sm font-medium text-text-muted">Position as of:</span>
            <span className="px-2.5 py-1 bg-text/5 text-text rounded-md font-mono text-sm font-semibold border border-text/10 shadow-sm">
              {currentData.date}
            </span>
            <span className="hidden sm:inline-block text-xs text-text-muted/60 pl-2 border-l border-text/10">
              Real-time asset valuation
            </span>
          </div>
        </div>
          <div className="flex items-center gap-2 sm:gap-3 bg-surface p-2 rounded-2xl shadow-sm border border-text/5">
            <ThemeToggle />
            <div className="h-6 w-px bg-text/10 mx-1"></div>
            <button onClick={() => setModalState({ isOpen: true, type: 'newSnapshot' })} className="p-2 bg-primary/10 text-primary rounded-xl hover:bg-primary hover:text-background transition-colors" title="Add New Snapshot"><DocumentPlusIcon className="w-5 h-5" /></button>
            <div className="h-6 w-px bg-text/10 mx-1"></div>
            <button onClick={handleExit} className="px-4 py-2 bg-transparent text-text-muted hover:text-accent-red hover:bg-accent-red/10 rounded-xl font-semibold text-sm transition-colors">{isDemo ? 'Exit Demo' : 'Sign Out'}</button>
          </div>
        </header>

        <div className="flex space-x-1 bg-surface border border-text/5 p-1 rounded-2xl mb-8 w-fit shadow-sm overflow-x-auto max-w-full custom-scrollbar">
          {tabs.map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all whitespace-nowrap ${activeTab === tab.id ? 'bg-background text-primary shadow-sm border border-text/5' : 'text-text-muted hover:text-text hover:bg-text/5'}`}>
              <tab.icon className={`w-5 h-5 ${activeTab === tab.id ? 'text-primary' : 'text-text-muted'}`} />{tab.name}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={activeTab + currentData.date} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
            
            {activeTab === 'overview' && (
              <div className="space-y-6 sm:space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {stats.map((stat, i) => (
                    <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1, duration: 0.5 }} className="premium-card flex items-center gap-5">
                      <div className={`p-4 rounded-2xl ${stat.bg}`}><stat.icon className={`w-8 h-8 ${stat.iconColor}`} /></div>
                      <div>
                        <p className="text-sm font-semibold text-text-muted mb-1">{stat.label}</p>
                        <AnimatedCounter value={stat.value} className={`text-3xl font-bold font-mono ${stat.color}`} />
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 premium-card flex flex-col">
                    <h3 className="text-xl font-bold text-text mb-6">Net Worth Trend</h3>
                    <div className="flex-1 min-h-[350px] w-full"><NetWorthChart data={data} /></div>
                  </div>
                  <div className="lg:col-span-1 premium-card flex flex-col">
                    <h3 className="text-xl font-bold text-text mb-6">Asset Allocation</h3>
                    <div className="flex-1 min-h-[350px] w-full flex items-center justify-center"><AllocationChart data={currentData.categories} /></div>
                  </div>
                </div>

                {topMovers && topMovers.length > 0 && (
                  <div className="premium-card">
                    <h3 className="text-xl font-bold text-text mb-6">Recent Changes (Since Last Snapshot)</h3>
                    <div className="h-[350px] w-full"><BiggestMoversChart data={topMovers} /></div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'goals' && (
              <div className="space-y-6">
                <div className="flex justify-between items-end border-b border-text/10 pb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-text">Financial Milestones</h2>
                    <p className="text-text-muted text-sm mt-1">Track your progress towards your biggest targets.</p>
                  </div>
                  <button onClick={() => setModalState({ isOpen: true, type: 'newGoal' })} className="flex items-center gap-2 text-sm font-semibold text-primary bg-primary/10 px-4 py-2 rounded-xl hover:bg-primary hover:text-background transition-colors">
                    <PlusCircleIcon className="w-5 h-5" /> Add Goal
                  </button>
                </div>

                {!goals || goals.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 text-center">
                    <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-4"><TrophyIcon className="w-10 h-10 text-primary" /></div>
                    <h3 className="text-xl font-bold text-text mb-2">No goals set yet</h3>
                    <p className="text-text-muted max-w-sm mb-6">Give your money a purpose. Set a target for a house, car, or your ultimate financial independence number.</p>
                    <button onClick={() => setModalState({ isOpen: true, type: 'newGoal' })} className="px-5 py-2.5 bg-primary text-background font-bold rounded-xl shadow-lg hover:-translate-y-0.5 transition-all">Create First Goal</button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {goals.map((goal, index) => {
                      const currentProgress = goal.isNetWorthLinked ? netWorth : goal.currentAmount;
                      const rawPercentage = (currentProgress / goal.targetAmount) * 100;
                      const percentage = Math.max(0, Math.min(rawPercentage, 100));
                      const GoalIcon = ICONS[goal.icon] || TrophyIcon;
                      const isGoalMet = currentProgress >= goal.targetAmount;

                      return (
                        <motion.div key={goal.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: index * 0.1 }} className="premium-card relative overflow-hidden group">
                          
                          <div className="flex justify-between items-start mb-4">
                            <div className={`p-3 rounded-2xl ${goal.color} bg-opacity-20`}>
                              <GoalIcon className={`w-7 h-7 ${goal.color.replace('bg-', 'text-')}`} />
                            </div>
                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button onClick={() => setModalState({ isOpen: true, type: 'editGoal', data: goal })} className="p-1.5 bg-text/5 rounded-xl text-text-muted hover:text-primary transition-colors"><PencilSquareIcon className="w-4 h-4" /></button>
                              <button onClick={() => handleDeleteGoal(goal.id)} className="p-1.5 bg-text/5 rounded-xl text-text-muted hover:text-accent-red transition-colors"><TrashIcon className="w-4 h-4" /></button>
                            </div>
                          </div>

                          <h3 className="text-xl font-bold text-text">{goal.name}</h3>
                          {goal.isNetWorthLinked && <span className="inline-block mt-1 px-2 py-0.5 bg-text/5 text-text-muted text-[10px] uppercase font-bold tracking-wider rounded-md">Auto-Linked to Net Worth</span>}

                          <div className="flex items-end gap-2 mt-4 mb-3">
                            <span className={`text-3xl font-mono font-extrabold ${isGoalMet ? 'text-accent-green' : 'text-text'}`}>{formatCurrency(currentProgress)}</span>
                            <span className="text-text-muted font-medium mb-1">/ {formatCurrency(goal.targetAmount)}</span>
                          </div>

                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-semibold text-text-muted">Progress</span>
                            <span className={`font-mono font-bold ${isGoalMet ? 'text-accent-green' : 'text-text'}`}>{rawPercentage.toFixed(1)}%</span>
                          </div>

                          <div className="w-full bg-text/5 rounded-full h-2.5 overflow-hidden">
                            <motion.div initial={{ width: 0 }} animate={{ width: `${percentage}%` }} transition={{ duration: 1.2, ease: "easeOut" }} className={`h-full rounded-full relative ${isGoalMet ? 'bg-accent-green' : goal.color}`}>
                               <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-[shimmer_2s_infinite]"></div>
                            </motion.div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'ledger' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="space-y-6">
                   <div className="flex justify-between items-end border-b border-text/10 pb-4">
                     <div><h2 className="text-2xl font-bold text-text">Assets</h2><p className="text-text-muted text-sm mt-1">What you own</p></div>
                     <button onClick={() => handleAddNewCategory('asset')} className="flex items-center gap-2 text-sm font-semibold text-primary bg-primary/10 px-4 py-2 rounded-xl hover:bg-primary hover:text-background transition-colors"><PlusCircleIcon className="w-5 h-5" /> Add Category</button>
                   </div>
                   <div className="space-y-4">
                     {currentData.categories.filter(c => c.type === 'asset').map(category => (
                       <CategoryCard key={category.id} category={category} onUpdateCategory={handleUpdateCategory} onDeleteCategory={() => handleDeleteCategory(category.id)} onSelectCategory={handleShowCategoryTrend} onSelectSubcategory={handleShowSubcategoryTrend} />
                     ))}
                   </div>
                </div>
                
                <div className="space-y-6">
                   <div className="flex justify-between items-end border-b border-text/10 pb-4">
                     <div><h2 className="text-2xl font-bold text-text">Liabilities</h2><p className="text-text-muted text-sm mt-1">What you owe</p></div>
                     <button onClick={() => handleAddNewCategory('liability')} className="flex items-center gap-2 text-sm font-semibold text-accent-red bg-accent-red/10 px-4 py-2 rounded-xl hover:bg-accent-red hover:text-white transition-colors"><PlusCircleIcon className="w-5 h-5" /> Add Category</button>
                   </div>
                   <div className="space-y-4">
                     {currentData.categories.filter(c => c.type === 'liability').map(category => (
                       <CategoryCard key={category.id} category={category} onUpdateCategory={handleUpdateCategory} onDeleteCategory={() => handleDeleteCategory(category.id)} onSelectCategory={handleShowCategoryTrend} onSelectSubcategory={handleShowSubcategoryTrend} />
                     ))}
                   </div>
                </div>
              </div>
            )}

            {activeTab === 'history' && (
              <div className="premium-card p-0 border border-text/5 overflow-hidden flex flex-col relative">
                <div ref={historyScrollRef} className="overflow-y-auto overflow-x-auto max-h-[65vh] custom-scrollbar">
                  <table className="w-full text-left border-collapse">
                    <thead className="sticky top-0 z-20 bg-surface/95 backdrop-blur-md shadow-sm border-b border-text/10">
                      <tr>
                        <th className="p-5 font-bold text-text-muted text-xs uppercase tracking-wider whitespace-nowrap">Date</th>
                        <th className="p-5 font-bold text-text-muted text-xs uppercase tracking-wider text-right whitespace-nowrap">Assets</th>
                        <th className="p-5 font-bold text-text-muted text-xs uppercase tracking-wider text-right whitespace-nowrap">Liabilities</th>
                        <th className="p-5 font-bold text-text-muted text-xs uppercase tracking-wider text-right whitespace-nowrap">Net Worth</th>
                        <th className="p-5 font-bold text-text-muted text-xs uppercase tracking-wider text-center whitespace-nowrap">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-text/5">
                      {data.map((snap, index) => {
                        const totals = getSnapshotTotals(snap);
                        const isCurrent = index === selectedDataIndex;
                        return (
                          <tr key={snap.date} className={`group transition-all duration-200 even:bg-text/[0.02] hover:bg-text/[0.06] ${isCurrent ? 'bg-primary/5 even:bg-primary/5 border-l-4 border-l-primary' : 'border-l-4 border-l-transparent'}`}>
                            <td className="p-5 font-semibold text-text flex items-center gap-3 whitespace-nowrap">
                              {snap.date} 
                              {isCurrent && <span className="text-[10px] bg-primary text-background px-2.5 py-0.5 rounded-full uppercase tracking-widest font-bold shadow-sm">Active</span>}
                            </td>
                            <td className="p-5 font-mono text-accent-green text-right whitespace-nowrap">{formatCurrency(totals.assets)}</td>
                            <td className="p-5 font-mono text-accent-red text-right whitespace-nowrap">{formatCurrency(Math.abs(totals.liabilities))}</td>
                            <td className="p-5 font-mono font-extrabold text-text text-right whitespace-nowrap">{formatCurrency(totals.netWorth)}</td>
                            <td className="p-5 flex justify-center items-center gap-2 whitespace-nowrap">
                              <button onClick={() => { setSelectedDataIndex(index); setActiveTab('overview'); }} className={`px-4 py-1.5 text-sm font-bold rounded-lg transition-all ${isCurrent ? 'bg-primary text-background shadow-md' : 'bg-text/5 text-text-muted hover:bg-primary hover:text-background hover:shadow-md'}`}>
                                {isCurrent ? 'Viewing' : 'View'}
                              </button>
                              <button onClick={() => handleDeleteSnapshot(snap.date)} className="p-1.5 bg-text/5 text-text-muted hover:bg-accent-red hover:text-white rounded-lg transition-all opacity-0 group-hover:opacity-100 focus:opacity-100" title="Delete Snapshot">
                                <TrashIcon className="w-5 h-5" />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            
          </motion.div>
        </AnimatePresence>
        <Footer />
      </div>
    </>
  );
};

export default Dashboard;