// src/components/CategoryCard.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PencilSquareIcon, TrashIcon, PlusCircleIcon, CheckIcon, XMarkIcon, ChevronDownIcon } from '@heroicons/react/24/outline';

const formatCurrency = (value) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);

// ADDED groupTotal = 0 to the props
const CategoryCard = ({ category, groupTotal = 0, onUpdateCategory, onDeleteCategory, onSelectCategory, onSelectSubcategory }) => {
  const isAsset = category.type === 'asset';
  const colorClass = isAsset ? 'text-accent-green' : 'text-accent-red';
  const bgClass = isAsset ? 'bg-accent-green' : 'bg-accent-red';
  
  const categoryTotal = category.subcategories.reduce((sum, sub) => sum + Math.abs(sub.value), 0);
  
  // BI Logic: Category % of Total Assets/Liabilities
  const categoryPercentage = groupTotal > 0 ? (categoryTotal / groupTotal) * 100 : 0;

  // --- UI States ---
  const [isExpanded, setIsExpanded] = useState(true);

  // --- Inline Editing State ---
  const [editingCatName, setEditingCatName] = useState(false);
  const [catNameInput, setCatNameInput] = useState(category.name);

  const [addingSub, setAddingSub] = useState(false);
  const [newSub, setNewSub] = useState({ name: '', value: '' });

  const [editingSubId, setEditingSubId] = useState(null);
  const [editSubData, setEditSubData] = useState({ name: '', value: '' });

  // --- Handlers ---
  const handleSaveCatName = (e) => {
    e?.stopPropagation();
    if (catNameInput.trim()) {
      onUpdateCategory({ ...category, name: catNameInput.trim() });
    } else {
      setCatNameInput(category.name);
    }
    setEditingCatName(false);
  };

  const handleSaveNewSub = () => {
    if (!newSub.name.trim() || newSub.value === '') return;
    const numericValue = parseFloat(newSub.value);
    if (isNaN(numericValue)) return;

    const finalValue = isAsset ? Math.abs(numericValue) : -Math.abs(numericValue);
    const newSubcategory = { id: `sub_${Date.now()}`, name: newSub.name.trim(), value: finalValue };
    
    onUpdateCategory({ ...category, subcategories: [...category.subcategories, newSubcategory] });
    setAddingSub(false);
    setNewSub({ name: '', value: '' });
  };

  const handleSaveEditSub = () => {
    if (!editSubData.name.trim() || editSubData.value === '') return;
    const numericValue = parseFloat(editSubData.value);
    if (isNaN(numericValue)) return;

    const finalValue = isAsset ? Math.abs(numericValue) : -Math.abs(numericValue);
    const updatedSubs = category.subcategories.map(s => 
      s.id === editingSubId ? { ...s, name: editSubData.name.trim(), value: finalValue } : s
    );
    
    onUpdateCategory({ ...category, subcategories: updatedSubs });
    setEditingSubId(null);
  };

  const handleDeleteSub = (subId) => {
    if (window.confirm("Delete this item?")) {
      onUpdateCategory({ ...category, subcategories: category.subcategories.filter(s => s.id !== subId) });
    }
  };

  // --- Keyboard Shortcuts ---
  const handleKeyDown = (e, saveAction, cancelAction) => {
    if (e.key === 'Enter') saveAction(e);
    if (e.key === 'Escape') cancelAction(e);
  };

  return (
    <motion.div layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="premium-card p-0 overflow-hidden group/card border border-text/5 hover:border-text/10 transition-colors">
      
      {/* HEADER SECTION */}
      <div 
        onClick={() => setIsExpanded(!isExpanded)}
        className={`flex justify-between items-center p-5 cursor-pointer select-none transition-colors duration-300 ${isExpanded ? 'border-b border-text/5 bg-surface' : 'bg-text/[0.02] hover:bg-text/[0.04]'}`}
      >
        <div className="flex-1">
          {editingCatName ? (
            <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
              <input 
                autoFocus value={catNameInput} onChange={e => setCatNameInput(e.target.value)}
                onKeyDown={e => handleKeyDown(e, handleSaveCatName, () => setEditingCatName(false))}
                className="bg-background border border-primary/30 rounded-lg px-3 py-1.5 text-lg font-bold text-text outline-none focus:border-primary transition-colors w-full max-w-[240px] shadow-sm"
              />
              <button onClick={handleSaveCatName} className="text-primary bg-primary/10 hover:bg-primary hover:text-background p-1.5 rounded-lg transition-colors"><CheckIcon className="w-5 h-5"/></button>
              <button onClick={() => setEditingCatName(false)} className="text-text-muted hover:bg-text/10 hover:text-text p-1.5 rounded-lg transition-colors"><XMarkIcon className="w-5 h-5"/></button>
            </div>
          ) : (
            <div className="flex flex-col items-start">
              <button 
                onClick={(e) => { e.stopPropagation(); onSelectCategory(category.id, category.name); }} 
                className="text-xl font-bold text-text text-left hover:text-primary transition-colors"
                title="View Category Trend"
              >
                {category.name}
              </button>
              <div className="flex items-center gap-3 mt-0.5">
                <p className={`font-mono text-lg font-extrabold ${colorClass}`}>{formatCurrency(categoryTotal)}</p>
                
                {/* 1% Upgrade: Category % of Total Portfolio Badge */}
                {groupTotal > 0 && (
                  <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider bg-text/5 px-2 py-0.5 rounded-md border border-text/5">
                    {categoryPercentage.toFixed(1)}% of Total
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-2 sm:gap-4 pl-4">
          {!editingCatName && (
            <div className="flex gap-1 opacity-20 group-hover/card:opacity-100 transition-opacity">
              <button onClick={(e) => { e.stopPropagation(); setAddingSub(true); setIsExpanded(true); }} className="p-2 rounded-xl text-text-muted hover:text-primary hover:bg-primary/10 transition-colors" title="Add Item">
                <PlusCircleIcon className="w-5 h-5" />
              </button>
              <button onClick={(e) => { e.stopPropagation(); setEditingCatName(true); }} className="p-2 rounded-xl text-text-muted hover:text-primary hover:bg-primary/10 transition-colors" title="Edit Category">
                <PencilSquareIcon className="w-5 h-5" />
              </button>
              <button onClick={(e) => { e.stopPropagation(); onDeleteCategory(category.id); }} className="p-2 rounded-xl text-text-muted hover:text-accent-red hover:bg-accent-red/10 transition-colors" title="Delete Category">
                <TrashIcon className="w-5 h-5" />
              </button>
            </div>
          )}
          
          <div className="h-6 w-px bg-text/10 mx-1 hidden sm:block"></div>
          <div className={`p-1.5 rounded-xl transition-transform duration-300 text-text-muted ${isExpanded ? 'rotate-180' : ''}`}>
            <ChevronDownIcon className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* SUBCATEGORIES LIST */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden bg-background/30"
          >
            <div className="p-5 space-y-5">
              {category.subcategories.map((sub, index) => {
                
                // BI Logic: Subcategory % of Category Total
                const subPercentage = categoryTotal > 0 ? (Math.abs(sub.value) / categoryTotal) * 100 : 0;
                const isEditingThis = editingSubId === sub.id;
                
                return (
                  <div key={sub.id} className="group/item relative">
                    {isEditingThis ? (
                      // INLINE EDITING ROW
                      <div className="flex items-center gap-2 mb-2 bg-text/5 p-2 rounded-xl border border-text/10 shadow-inner">
                        <input 
                          autoFocus placeholder="Name" value={editSubData.name} onChange={e => setEditSubData({...editSubData, name: e.target.value})}
                          onKeyDown={e => handleKeyDown(e, handleSaveEditSub, () => setEditingSubId(null))}
                          className="flex-1 bg-surface border border-transparent focus:border-primary rounded-lg px-3 py-1.5 text-sm font-semibold outline-none transition-colors"
                        />
                        <div className="relative w-32">
                          <span className="absolute left-3 top-1.5 text-text-muted font-bold text-sm">$</span>
                          <input 
                            type="number" step="0.01" value={editSubData.value} onChange={e => setEditSubData({...editSubData, value: e.target.value})}
                            onKeyDown={e => handleKeyDown(e, handleSaveEditSub, () => setEditingSubId(null))}
                            className="w-full bg-surface border border-transparent focus:border-primary rounded-lg pl-6 pr-2 py-1.5 text-sm font-mono font-bold outline-none transition-colors"
                          />
                        </div>
                        <button onClick={handleSaveEditSub} className="text-primary bg-primary/10 hover:bg-primary hover:text-background p-1.5 rounded-lg transition-colors"><CheckIcon className="w-5 h-5"/></button>
                        <button onClick={() => setEditingSubId(null)} className="text-text-muted hover:bg-text/10 hover:text-text p-1.5 rounded-lg transition-colors"><XMarkIcon className="w-5 h-5"/></button>
                      </div>
                    ) : (
                      // STANDARD DISPLAY ROW
                      <>
                        <div className="flex justify-between items-center text-sm mb-2">
                          <button onClick={() => onSelectSubcategory(sub.id, sub.name)} className="font-semibold text-text-muted text-left hover:text-primary transition-colors truncate pr-4">
                            {sub.name}
                          </button>
                          
                          <div className="flex items-center gap-3 shrink-0">
                            <div className="flex items-center gap-2.5">
                              {/* 1% Upgrade: Subcategory % text indicator */}
                              <span className="text-[11px] font-semibold text-text-muted opacity-70 w-10 text-right">
                                {subPercentage.toFixed(1)}%
                              </span>
                              <span className="font-mono font-bold text-text w-20 text-right">
                                {formatCurrency(Math.abs(sub.value))}
                              </span>
                            </div>
                            
                            {/* Hover Actions */}
                            <div className="flex opacity-0 -translate-x-2 group-hover/item:opacity-100 group-hover/item:translate-x-0 transition-all duration-200">
                              <button onClick={() => { setEditingSubId(sub.id); setEditSubData({ name: sub.name, value: Math.abs(sub.value) }); }} className="text-text-muted hover:text-primary hover:bg-primary/10 p-1 rounded-md transition-colors">
                                <PencilSquareIcon className="w-4 h-4" />
                              </button>
                              <button onClick={() => handleDeleteSub(sub.id)} className="text-text-muted hover:text-accent-red hover:bg-accent-red/10 p-1 rounded-md transition-colors">
                                <TrashIcon className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                        
                        {/* The Granular Progress Bar */}
                        <div className="w-full bg-text/5 rounded-full h-1.5 overflow-hidden">
                          <motion.div initial={{ width: 0 }} animate={{ width: `${subPercentage}%` }} transition={{ duration: 0.8, delay: index * 0.05, ease: "easeOut" }} className={`rounded-full h-full ${bgClass}`} />
                        </div>
                      </>
                    )}
                  </div>
                );
              })}

              {/* INLINE ADD NEW ITEM ROW */}
              {addingSub && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="flex items-center gap-2 mt-4 bg-primary/5 p-2 rounded-xl border border-primary/20 shadow-inner">
                  <input 
                    autoFocus placeholder="New Item Name" value={newSub.name} onChange={e => setNewSub({...newSub, name: e.target.value})}
                    onKeyDown={e => handleKeyDown(e, handleSaveNewSub, () => setAddingSub(false))}
                    className="flex-1 bg-surface border border-transparent focus:border-primary rounded-lg px-3 py-1.5 text-sm font-semibold outline-none transition-colors"
                  />
                  <div className="relative w-32">
                    <span className="absolute left-3 top-1.5 text-text-muted font-bold text-sm">$</span>
                    <input 
                      type="number" step="0.01" placeholder="0.00" value={newSub.value} onChange={e => setNewSub({...newSub, value: e.target.value})}
                      onKeyDown={e => handleKeyDown(e, handleSaveNewSub, () => setAddingSub(false))}
                      className="w-full bg-surface border border-transparent focus:border-primary rounded-lg pl-6 pr-2 py-1.5 text-sm font-mono font-bold outline-none transition-colors"
                    />
                  </div>
                  <button onClick={handleSaveNewSub} className="text-primary bg-primary/10 hover:bg-primary hover:text-background p-1.5 rounded-lg transition-colors"><CheckIcon className="w-5 h-5"/></button>
                  <button onClick={() => setAddingSub(false)} className="text-text-muted hover:bg-text/10 hover:text-text p-1.5 rounded-lg transition-colors"><XMarkIcon className="w-5 h-5"/></button>
                </motion.div>
              )}
              
              {/* Actionable Empty State */}
              {!addingSub && category.subcategories.length === 0 && (
                <button onClick={() => setAddingSub(true)} className="w-full py-8 flex flex-col items-center justify-center gap-2 border-2 border-dashed border-text/10 rounded-2xl text-text-muted hover:text-primary hover:border-primary/30 hover:bg-primary/5 transition-all group/empty mt-2">
                  <PlusCircleIcon className="w-8 h-8 opacity-50 group-hover/empty:opacity-100 group-hover/empty:scale-110 transition-all" />
                  <span className="text-sm font-bold tracking-wide">Click to add your first {isAsset ? 'asset' : 'liability'}</span>
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default CategoryCard;