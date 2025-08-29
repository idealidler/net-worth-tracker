// src/components/Dashboard.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DocumentPlusIcon, PlusCircleIcon, TrashIcon } from '@heroicons/react/24/outline';

// Import all our components
import Modal from './Modal';
import TrendModal from './TrendModal';
import DateSelector from './DateSelector';
import NetWorthChart from './NetWorthChart';
import AllocationChart from './AllocationChart';
import BiggestMoversChart from './BiggestMoversChart';
import CategoryCard from './CategoryCard';
import ThemeToggle from './ThemeToggle';
import NewSnapshotForm from './forms/NewSnapshotForm';
import CategoryForm from './forms/CategoryForm';
import SubcategoryForm from './forms/SubcategoryForm';

const formatCurrency = (value) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);

const Dashboard = ({ data, onUpdate, onAddNewSnapshot, onDeleteSnapshot, userName }) => {
  const [selectedDataIndex, setSelectedDataIndex] = useState(0);
  const [modalState, setModalState] = useState({ isOpen: false, type: null, data: null });
  const [targetDate, setTargetDate] = useState(null);
  const [trendState, setTrendState] = useState({ isOpen: false, data: [], name: '' });

  useEffect(() => {
    if (targetDate) {
      const newIndex = data.findIndex(d => d.date === targetDate);
      if (newIndex !== -1) {
        setSelectedDataIndex(newIndex);
        setTargetDate(null);
      }
    } else if (selectedDataIndex >= data.length) {
      setSelectedDataIndex(Math.max(0, data.length - 1));
    }
  }, [data, targetDate, selectedDataIndex]);

  const topMovers = useMemo(() => {
    if (!data || data.length < 2 || selectedDataIndex >= data.length - 1) {
      return null;
    }
    const currentSnapshot = data[selectedDataIndex];
    const previousSnapshot = data[selectedDataIndex + 1];
    const allSubcategories = {};
    currentSnapshot.categories.forEach(cat => {
      cat.subcategories.forEach(sub => {
        if (!allSubcategories[sub.id]) {
          allSubcategories[sub.id] = { name: sub.name, currentValue: 0, previousValue: 0 };
        }
        allSubcategories[sub.id].currentValue = sub.value;
      });
    });
    previousSnapshot.categories.forEach(cat => {
      cat.subcategories.forEach(sub => {
        if (!allSubcategories[sub.id]) {
          allSubcategories[sub.id] = { name: sub.name, currentValue: 0, previousValue: 0 };
        }
        allSubcategories[sub.id].previousValue = sub.value;
      });
    });
    const changes = Object.values(allSubcategories).map(sub => ({
      name: sub.name,
      change: sub.currentValue - sub.previousValue
    })).filter(sub => sub.change !== 0);
    changes.sort((a, b) => Math.abs(b.change) - Math.abs(a.change));
    return changes.slice(0, 5);
  }, [data, selectedDataIndex]);

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
        if (sub) {
          value = sub.value;
          break;
        }
      }
      return { date: snapshot.date, value };
    }).reverse();
    setTrendState({ isOpen: true, data: trendData, name: subcategoryName });
  };
  
  const closeTrendModal = () => setTrendState({ isOpen: false, data: [], name: '' });

  const handleDeleteCurrentSnapshot = () => {
    if (data.length <= 1) {
      alert("You cannot delete the last remaining snapshot.");
      return;
    }
    const dateToDelete = data[selectedDataIndex].date;
    if (window.confirm(`Are you sure you want to permanently delete the snapshot for ${dateToDelete}?`)) {
      onDeleteSnapshot(dateToDelete);
    }
  };

  const handleDataChange = (updatedCategories) => {
    const newDataEntry = { ...currentData, categories: updatedCategories };
    onUpdate(newDataEntry);
  };

  const handleNewSnapshotModal = () => setModalState({ isOpen: true, type: 'newSnapshot', data: null });
  const handleAddCategory = (assetType) => setModalState({ isOpen: true, type: 'addCategory', data: { assetType } });
  const handleEditCategory = (category) => setModalState({ isOpen: true, type: 'editCategory', data: { category } });
  const handleAddSubcategory = (category) => setModalState({ isOpen: true, type: 'addSubcategory', data: { category } });
  const handleEditSubcategory = (category, subcategory) => setModalState({ isOpen: true, type: 'editSubcategory', data: { category, subcategory } });
  const closeModal = () => setModalState({ isOpen: false, type: null, data: null });

  const onFormSubmit = (formData) => {
    const { type, data } = modalState;
    if (type === 'newSnapshot') {
      const newDate = formData;
      setTargetDate(newDate);
      onAddNewSnapshot(newDate);
      closeModal();
      return;
    }
    let updatedCategories;
    if (type === 'addCategory') {
      const newCategory = { id: `cat_${Date.now()}`, name: formData.name, type: data.assetType, subcategories: [] };
      updatedCategories = [...currentData.categories, newCategory];
    }
    if (type === 'editCategory') {
      updatedCategories = currentData.categories.map(c => c.id === data.category.id ? { ...c, name: formData.name } : c);
    }
    if (type === 'addSubcategory') {
      const newSub = { id: `sub_${Date.now()}`, name: formData.name, value: formData.value };
      updatedCategories = currentData.categories.map(c => c.id === data.category.id ? { ...c, subcategories: [...c.subcategories, newSub] } : c);
    }
    if (type === 'editSubcategory') {
      updatedCategories = currentData.categories.map(c => {
        if (c.id === data.category.id) {
          const subs = c.subcategories.map(s => s.id === data.subcategory.id ? { ...s, ...formData } : s);
          return { ...c, subcategories: subs };
        }
        return c;
      });
    }
    if (updatedCategories) handleDataChange(updatedCategories);
    closeModal();
  };

  const deleteCategory = (catId) => { if (window.confirm("Are you sure?")) handleDataChange(currentData.categories.filter(c => c.id !== catId)); };
  const deleteSubcategory = (catId, subId) => { if (window.confirm("Are you sure?")) handleDataChange(currentData.categories.map(c => c.id === catId ? { ...c, subcategories: c.subcategories.filter(s => s.id !== subId) } : c)); };

  if (!data || data.length === 0) {
    return (
      <div className="p-8 text-center text-text-muted max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-text">Welcome!</h1>
        <p className="mb-4">No data available. Add a new snapshot to get started.</p>
        <button onClick={handleNewSnapshotModal} className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-background font-bold rounded-lg hover:bg-primary-dark transition-colors"><DocumentPlusIcon className="w-5 h-5" /> Add First Snapshot</button>
      </div>
    );
  }

  const currentData = data[selectedDataIndex];
  let totalAssets = 0, totalLiabilities = 0;
  currentData.categories.forEach(cat => {
    const catTotal = cat.subcategories.reduce((sum, sub) => sum + sub.value, 0);
    if (cat.type === 'asset') totalAssets += catTotal;
    else totalLiabilities += catTotal;
  });
  const netWorth = totalAssets + totalLiabilities;
  
  const getModalContent = () => {
    const { type, data } = modalState;
    switch (type) {
      case 'newSnapshot':
        return { title: 'Create New Snapshot', form: <NewSnapshotForm onSubmit={onFormSubmit} onCancel={closeModal} /> };
      case 'addCategory':
      case 'editCategory':
        return { title: type === 'addCategory' ? `Add ${data.assetType}` : 'Edit Category', form: <CategoryForm onSubmit={onFormSubmit} initialData={data?.category} onCancel={closeModal} /> };
      case 'addSubcategory':
      case 'editSubcategory':
        return { title: type === 'addSubcategory' ? 'Add Item' : 'Edit Item', form: <SubcategoryForm onSubmit={onFormSubmit} initialData={data?.subcategory} onCancel={closeModal} assetType={data.category.type} /> };
      default:
        return { title: '', form: null };
    }
  };
  const { title, form } = getModalContent();

  return (
    <>
      <Modal isOpen={modalState.isOpen} onClose={closeModal} title={title}>{form}</Modal>
      <TrendModal isOpen={trendState.isOpen} onClose={closeTrendModal} data={trendState.data} name={trendState.name} />
      
      <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-text">Hey {userName}!</h1>
            <p className="text-text-muted">Welcome to your personalized net worth tracker!</p>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <DateSelector data={data} selectedIndex={selectedDataIndex} onSelect={setSelectedDataIndex} />
            <button onClick={handleNewSnapshotModal} className="p-2 bg-primary rounded-lg text-background hover:bg-primary-dark transition-colors" title="Add New Snapshot">
              <DocumentPlusIcon className="w-5 h-5" />
            </button>
            <button onClick={handleDeleteCurrentSnapshot} className="p-2 bg-accent-red/20 text-accent-red rounded-lg hover:bg-accent-red/40 transition-colors" title="Delete Current Snapshot">
              <TrashIcon className="w-5 h-5" />
            </button>
          </div>
        </header>

        <AnimatePresence mode="wait">
          <motion.div key={currentData.date} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              <div className="lg:col-span-2">
                <NetWorthChart data={data} />
              </div>
              <div className="bg-surface border border-text/10 rounded-xl p-4 flex flex-col justify-center">
                 <div className="mb-4">
                    <p className="text-sm text-text-muted uppercase tracking-wider">Total Net Worth</p>
                    <p className="text-4xl font-extrabold text-primary">{formatCurrency(netWorth)}</p>
                 </div>
                 <AllocationChart data={currentData.categories} />
              </div>
            </div>
            
            {topMovers && topMovers.length > 0 && (
              <div className="mb-6">
                <BiggestMoversChart data={topMovers} />
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-6">
                 <div className="flex justify-between items-center">
                   <h2 className="text-xl font-bold text-text">Assets <span className="text-accent-green font-mono text-lg">{formatCurrency(totalAssets)}</span></h2>
                   <button onClick={() => handleAddCategory('asset')} className="flex items-center gap-1 text-sm text-primary hover:text-primary-light transition-colors"><PlusCircleIcon className="w-5 h-5" /> Add Category</button>
                 </div>
                 {currentData.categories.filter(c => c.type === 'asset').map(category => (
                   <CategoryCard 
                      key={category.id} 
                      category={category}
                      onAddSub={() => handleAddSubcategory(category)}
                      onEditCat={() => handleEditCategory(category)}
                      onDeleteCat={() => deleteCategory(category.id)}
                      onEditSub={(sub) => handleEditSubcategory(category, sub)}
                      onDeleteSub={(subId) => deleteSubcategory(category.id, subId)}
                      onSelectCategory={handleShowCategoryTrend}
                      onSelectSubcategory={handleShowSubcategoryTrend}
                   />
                 ))}
              </div>
              <div className="space-y-6">
                 <div className="flex justify-between items-center">
                   <h2 className="text-xl font-bold text-text">Liabilities <span className="text-accent-red font-mono text-lg">{formatCurrency(totalLiabilities)}</span></h2>
                   <button onClick={() => handleAddCategory('liability')} className="flex items-center gap-1 text-sm text-primary hover:text-primary-light transition-colors"><PlusCircleIcon className="w-5 h-5" /> Add Category</button>
                 </div>
                 {currentData.categories.filter(c => c.type === 'liability').map(category => (
                   <CategoryCard 
                      key={category.id} 
                      category={category}
                      onAddSub={() => handleAddSubcategory(category)}
                      onEditCat={() => handleEditCategory(category)}
                      onDeleteCat={() => deleteCategory(category.id)}
                      onEditSub={(sub) => handleEditSubcategory(category, sub)}
                      onDeleteSub={(subId) => deleteSubcategory(category.id, subId)}
                      onSelectCategory={handleShowCategoryTrend}
                      onSelectSubcategory={handleShowSubcategoryTrend}
                   />
                 ))}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </>
  );
};

export default Dashboard;