// src/components/Dashboard.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  DocumentPlusIcon, PlusCircleIcon, TrashIcon, 
  ChartPieIcon, BookOpenIcon, ClockIcon 
} from '@heroicons/react/24/outline';
import { CurrencyDollarIcon, BanknotesIcon, CreditCardIcon } from '@heroicons/react/24/solid';

// 1% Architecture Upgrade: Import our new React Query hooks!
import { useSnapshots, useUpdateSnapshot, useAddSnapshot, useDeleteSnapshot } from '../hooks/useNetWorth';
import { templateData } from '../data/templateData';

import Modal from './Modal';
import TrendModal from './TrendModal';
import NetWorthChart from './NetWorthChart';
import AllocationChart from './AllocationChart';
import BiggestMoversChart from './BiggestMoversChart';
import CategoryCard from './CategoryCard';
import ThemeToggle from './ThemeToggle';
import NewSnapshotForm from './forms/NewSnapshotForm';
import CategoryForm from './forms/CategoryForm';
import SubcategoryForm from './forms/SubcategoryForm';

const formatCurrency = (value) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);

const Dashboard = ({ userName }) => {
  // --- React Query Hooks ---
  const { data, isLoading } = useSnapshots();
  const updateSnapshot = useUpdateSnapshot();
  const addSnapshot = useAddSnapshot();
  const deleteSnapshot = useDeleteSnapshot();

  const [selectedDataIndex, setSelectedDataIndex] = useState(0);
  const [activeTab, setActiveTab] = useState('overview'); 
  const [modalState, setModalState] = useState({ isOpen: false, type: null, data: null });
  const [targetDate, setTargetDate] = useState(null);
  const [trendState, setTrendState] = useState({ isOpen: false, data: [], name: '' });

  useEffect(() => {
    if (!data) return;
    if (targetDate) {
      const newIndex = data.findIndex(d => d.date === targetDate);
      if (newIndex !== -1) {
        setSelectedDataIndex(newIndex);
        setTargetDate(null);
        setActiveTab('overview');
      }
    } else if (selectedDataIndex >= data.length) {
      setSelectedDataIndex(Math.max(0, data.length - 1));
    }
  }, [data, targetDate, selectedDataIndex]);

  // --- Calculations ---
  const topMovers = useMemo(() => {
    if (!data || data.length < 2 || selectedDataIndex >= data.length - 1) return null;
    const currentSnapshot = data[selectedDataIndex];
    const previousSnapshot = data[selectedDataIndex + 1];
    const allSubcategories = {};
    
    currentSnapshot.categories.forEach(cat => {
      cat.subcategories.forEach(sub => {
        if (!allSubcategories[sub.id]) allSubcategories[sub.id] = { name: sub.name, currentValue: 0, previousValue: 0 };
        allSubcategories[sub.id].currentValue = sub.value;
      });
    });
    
    previousSnapshot.categories.forEach(cat => {
      cat.subcategories.forEach(sub => {
        if (!allSubcategories[sub.id]) allSubcategories[sub.id] = { name: sub.name, currentValue: 0, previousValue: 0 };
        allSubcategories[sub.id].previousValue = sub.value;
      });
    });
    
    const changes = Object.values(allSubcategories).map(sub => ({
      name: sub.name, change: sub.currentValue - sub.previousValue
    })).filter(sub => sub.change !== 0);
    
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

  // --- Handlers ---
  const handleShowCategoryTrend = (categoryId, categoryName) => {
    const trendData = data.map(snapshot => {
      const category = snapshot.categories.find(c => c.id === categoryId);
      const value = category ? category.subcategories.reduce((sum, sub) => sum + sub.value, 0) : 0;
      return { date: snapshot.date, value };
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
    if (data.length <= 1) {
      alert("You cannot delete your only snapshot.");
      return;
    }
    if (window.confirm(`Permanently delete the snapshot for ${dateToDelete}?`)) {
      // Replaced old prop function with React Query Mutation!
      deleteSnapshot.mutate(dateToDelete, {
        onSuccess: () => setSelectedDataIndex(0)
      });
    }
  };

  const handleDataChange = (updatedCategories) => {
    // Replaced old prop function with React Query Mutation!
    updateSnapshot.mutate({ ...data[selectedDataIndex], categories: updatedCategories });
  };

  const onFormSubmit = (formData) => {
    const { type, data: modalData } = modalState;
    
    if (type === 'newSnapshot') {
      const existingIndex = data.findIndex(d => d.date === formData);
      if (existingIndex !== -1) {
        alert("A snapshot for this date already exists.");
        return;
      }
      const latestSnapshot = data.length > 0 ? data[0] : templateData[0];
      const newSnapshot = { ...latestSnapshot, date: formData };
      
      // Replaced old prop function with React Query Mutation!
      addSnapshot.mutate(newSnapshot, {
        onSuccess: () => setTargetDate(formData)
      });
      setModalState({ isOpen: false, type: null, data: null });
      return;
    }
    
    let updatedCategories;
    const currentData = data[selectedDataIndex];

    if (type === 'addCategory') {
      updatedCategories = [...currentData.categories, { id: `cat_${Date.now()}`, name: formData.name, type: modalData.assetType, subcategories: [] }];
    } else if (type === 'editCategory') {
      updatedCategories = currentData.categories.map(c => c.id === modalData.category.id ? { ...c, name: formData.name } : c);
    } else if (type === 'addSubcategory') {
      updatedCategories = currentData.categories.map(c => c.id === modalData.category.id ? { ...c, subcategories: [...c.subcategories, { id: `sub_${Date.now()}`, name: formData.name, value: formData.value }] } : c);
    } else if (type === 'editSubcategory') {
      updatedCategories = currentData.categories.map(c => c.id === modalData.category.id ? { ...c, subcategories: c.subcategories.map(s => s.id === modalData.subcategory.id ? { ...s, ...formData } : s) } : c);
    }
    
    if (updatedCategories) handleDataChange(updatedCategories);
    setModalState({ isOpen: false, type: null, data: null });
  };

  // --- Loading & Empty States ---
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-text/10 border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 text-center max-w-7xl mx-auto">
        <h1 className="text-4xl font-extrabold text-text mb-2">Welcome, {userName}!</h1>
        <p className="mb-8 text-lg text-text-muted">Your financial journey starts here. Add your first snapshot.</p>
        <button onClick={() => setModalState({ isOpen: true, type: 'newSnapshot', data: null })} className="px-6 py-3 bg-primary text-background font-bold rounded-xl shadow-lg hover:shadow-primary/20 hover:-translate-y-0.5 transition-all flex items-center gap-2">
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
    { id: 'history', name: 'History', icon: ClockIcon },
  ];

  return (
    <>
      <Modal isOpen={modalState.isOpen} onClose={() => setModalState({ isOpen: false, type: null, data: null })} title={modalState.type === 'newSnapshot' ? 'Create Snapshot' : modalState.type?.includes('Category') ? 'Category' : 'Item'}>
        {modalState.type === 'newSnapshot' && <NewSnapshotForm onSubmit={onFormSubmit} onCancel={() => setModalState({ isOpen: false, type: null, data: null })} />}
        {modalState.type?.includes('Category') && <CategoryForm onSubmit={onFormSubmit} initialData={modalState.data?.category} onCancel={() => setModalState({ isOpen: false, type: null, data: null })} />}
        {modalState.type?.includes('Subcategory') && <SubcategoryForm onSubmit={onFormSubmit} initialData={modalState.data?.subcategory} onCancel={() => setModalState({ isOpen: false, type: null, data: null })} assetType={modalState.data?.category?.type} />}
      </Modal>
      <TrendModal isOpen={trendState.isOpen} onClose={() => setTrendState({ isOpen: false, data: [], name: '' })} data={trendState.data} name={trendState.name} />
      
      <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-6">
          <div>
            <h1 className="text-3xl font-extrabold text-text tracking-tight mb-1">Dashboard</h1>
            <div className="flex items-center gap-3 mt-2">
              <span className="text-text-muted font-medium">Viewing data for:</span>
              <span className="px-3 py-1 bg-primary/10 text-primary rounded-lg font-mono text-sm font-bold border border-primary/20">
                {currentData.date}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-surface p-2 rounded-2xl shadow-sm border border-text/5">
            <ThemeToggle />
            <div className="h-6 w-px bg-text/10 mx-1"></div>
            <button onClick={() => setModalState({ isOpen: true, type: 'newSnapshot', data: null })} className="p-2 bg-primary/10 text-primary rounded-xl hover:bg-primary hover:text-background transition-colors" title="Add New Snapshot">
              <DocumentPlusIcon className="w-5 h-5" />
            </button>
          </div>
        </header>

        <div className="flex space-x-1 bg-surface border border-text/5 p-1 rounded-2xl mb-8 w-fit shadow-sm">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                activeTab === tab.id
                  ? 'bg-background text-primary shadow-sm border border-text/5'
                  : 'text-text-muted hover:text-text hover:bg-text/5'
              }`}
            >
              <tab.icon className={`w-5 h-5 ${activeTab === tab.id ? 'text-primary' : 'text-text-muted'}`} />
              {tab.name}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={activeTab + currentData.date} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
            
            {activeTab === 'overview' && (
              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {stats.map((stat, i) => (
                    <div key={stat.label} className="premium-card flex items-center gap-5">
                      <div className={`p-4 rounded-2xl ${stat.bg}`}>
                        <stat.icon className={`w-8 h-8 ${stat.iconColor}`} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-text-muted mb-1">{stat.label}</p>
                        <h3 className={`text-3xl font-bold font-mono ${stat.color}`}>{formatCurrency(stat.value)}</h3>
                      </div>
                    </div>
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

            {activeTab === 'ledger' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="space-y-6">
                   <div className="flex justify-between items-end border-b border-text/10 pb-4">
                     <div>
                       <h2 className="text-2xl font-bold text-text">Assets</h2>
                       <p className="text-text-muted text-sm mt-1">What you own</p>
                     </div>
                     <button onClick={() => setModalState({ isOpen: true, type: 'addCategory', data: { assetType: 'asset' }})} className="flex items-center gap-2 text-sm font-semibold text-primary bg-primary/10 px-4 py-2 rounded-xl hover:bg-primary hover:text-background transition-colors">
                       <PlusCircleIcon className="w-5 h-5" /> Add Category
                     </button>
                   </div>
                   <div className="space-y-4">
                     {currentData.categories.filter(c => c.type === 'asset').map(category => (
                       <CategoryCard 
                          key={category.id} category={category}
                          onAddSub={() => setModalState({ isOpen: true, type: 'addSubcategory', data: { category }})}
                          onEditCat={() => setModalState({ isOpen: true, type: 'editCategory', data: { category }})}
                          onDeleteCat={() => { if(window.confirm("Are you sure?")) handleDataChange(currentData.categories.filter(c => c.id !== category.id))}}
                          onEditSub={(sub) => setModalState({ isOpen: true, type: 'editSubcategory', data: { category, subcategory: sub }})}
                          onDeleteSub={(subId) => { if(window.confirm("Are you sure?")) handleDataChange(currentData.categories.map(c => c.id === category.id ? { ...c, subcategories: c.subcategories.filter(s => s.id !== subId) } : c))}}
                          onSelectCategory={handleShowCategoryTrend} onSelectSubcategory={handleShowSubcategoryTrend}
                       />
                     ))}
                   </div>
                </div>
                
                <div className="space-y-6">
                   <div className="flex justify-between items-end border-b border-text/10 pb-4">
                     <div>
                       <h2 className="text-2xl font-bold text-text">Liabilities</h2>
                       <p className="text-text-muted text-sm mt-1">What you owe</p>
                     </div>
                     <button onClick={() => setModalState({ isOpen: true, type: 'addCategory', data: { assetType: 'liability' }})} className="flex items-center gap-2 text-sm font-semibold text-accent-red bg-accent-red/10 px-4 py-2 rounded-xl hover:bg-accent-red hover:text-white transition-colors">
                       <PlusCircleIcon className="w-5 h-5" /> Add Category
                     </button>
                   </div>
                   <div className="space-y-4">
                     {currentData.categories.filter(c => c.type === 'liability').map(category => (
                       <CategoryCard 
                          key={category.id} category={category}
                          onAddSub={() => setModalState({ isOpen: true, type: 'addSubcategory', data: { category }})}
                          onEditCat={() => setModalState({ isOpen: true, type: 'editCategory', data: { category }})}
                          onDeleteCat={() => { if(window.confirm("Are you sure?")) handleDataChange(currentData.categories.filter(c => c.id !== category.id))}}
                          onEditSub={(sub) => setModalState({ isOpen: true, type: 'editSubcategory', data: { category, subcategory: sub }})}
                          onDeleteSub={(subId) => { if(window.confirm("Are you sure?")) handleDataChange(currentData.categories.map(c => c.id === category.id ? { ...c, subcategories: c.subcategories.filter(s => s.id !== subId) } : c))}}
                          onSelectCategory={handleShowCategoryTrend} onSelectSubcategory={handleShowSubcategoryTrend}
                       />
                     ))}
                   </div>
                </div>
              </div>
            )}

            {activeTab === 'history' && (
              <div className="premium-card overflow-hidden p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-text/5 border-b border-text/10">
                        <th className="p-5 font-semibold text-text-muted text-sm uppercase tracking-wider">Date</th>
                        <th className="p-5 font-semibold text-text-muted text-sm uppercase tracking-wider text-right">Assets</th>
                        <th className="p-5 font-semibold text-text-muted text-sm uppercase tracking-wider text-right">Liabilities</th>
                        <th className="p-5 font-semibold text-text-muted text-sm uppercase tracking-wider text-right">Net Worth</th>
                        <th className="p-5 font-semibold text-text-muted text-sm uppercase tracking-wider text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-text/5">
                      {data.map((snap, index) => {
                        const totals = getSnapshotTotals(snap);
                        const isCurrent = index === selectedDataIndex;
                        return (
                          <tr key={snap.date} className={`transition-colors hover:bg-text/5 ${isCurrent ? 'bg-primary/5' : ''}`}>
                            <td className="p-5 font-semibold text-text">{snap.date} {isCurrent && <span className="ml-2 text-xs bg-primary text-background px-2 py-1 rounded-full uppercase tracking-wider">Active</span>}</td>
                            <td className="p-5 font-mono text-accent-green text-right">{formatCurrency(totals.assets)}</td>
                            <td className="p-5 font-mono text-accent-red text-right">{formatCurrency(Math.abs(totals.liabilities))}</td>
                            <td className="p-5 font-mono font-bold text-primary text-right">{formatCurrency(totals.netWorth)}</td>
                            <td className="p-5 flex justify-center gap-3">
                              <button 
                                onClick={() => { setSelectedDataIndex(index); setActiveTab('overview'); }}
                                className="px-4 py-2 bg-text/10 hover:bg-primary hover:text-background text-text text-sm font-semibold rounded-lg transition-colors"
                              >
                                View
                              </button>
                              <button 
                                onClick={() => handleDeleteSnapshot(snap.date)}
                                className="p-2 bg-accent-red/10 text-accent-red hover:bg-accent-red hover:text-white rounded-lg transition-colors"
                                title="Delete Snapshot"
                              >
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
      </div>
    </>
  );
};

export default Dashboard;