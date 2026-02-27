// src/components/CategoryCard.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  PencilSquareIcon, TrashIcon, PlusCircleIcon, CheckIcon, XMarkIcon, 
  ChevronDownIcon, TableCellsIcon, EllipsisHorizontalIcon 
} from '@heroicons/react/24/outline';

const formatCurrency = (value) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);

// ==========================================
// CENTRALIZED FINANCIAL LOGIC
// ==========================================
const FinancialMath = {
  sumCategory: (subcategories) => subcategories.reduce((sum, sub) => sum + Math.abs(sub.value), 0),
  toDisplay: (value, isAsset) => isAsset ? Math.abs(value) : -Math.abs(value),
  toStorage: (inputValue, isAsset) => {
    const numericValue = parseFloat(inputValue) || 0;
    return isAsset ? Math.abs(numericValue) : -Math.abs(numericValue);
  }
};

// ==========================================
// SUB-COMPONENT 1: Category 3-Dot Menu
// ==========================================
const CategoryMenu = ({ onEdit, onDeleteRequest }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="relative" onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget)) setIsOpen(false); }}>
      <button 
        onClick={(e) => { e.stopPropagation(); setIsOpen(!isOpen); }}
        aria-label="Category Options"
        aria-expanded={isOpen}
        className="p-1.5 rounded-xl text-text-muted hover:text-primary hover:bg-primary/10 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20"
      >
        <EllipsisHorizontalIcon className="w-5 h-5" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: -5 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: -5 }} transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-1 w-48 bg-surface border border-text/10 rounded-xl shadow-lg z-20 overflow-hidden"
          >
            <div className="p-1 flex flex-col">
              <button onClick={(e) => { e.stopPropagation(); setIsOpen(false); onEdit(); }} className="flex items-center gap-2 px-3 py-2 text-sm font-semibold text-text hover:bg-text/5 rounded-lg transition-colors text-left w-full">
                <PencilSquareIcon className="w-4 h-4" /> Rename Category
              </button>
              <button onClick={(e) => { e.stopPropagation(); setIsOpen(false); onDeleteRequest(); }} className="flex items-center gap-2 px-3 py-2 text-sm font-semibold text-accent-red hover:bg-accent-red/10 rounded-lg transition-colors text-left w-full">
                <TrashIcon className="w-4 h-4" /> Delete Category
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ==========================================
// SUB-COMPONENT 2: Standard Subcategory Row
// ==========================================
const SubcategoryRow = ({ sub, categoryTotal, isAsset, bgClass, onSelect, onEdit, onDelete }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const subPercentage = categoryTotal > 0 ? (Math.abs(sub.value) / categoryTotal) * 100 : 0;
  const displayValue = FinancialMath.toDisplay(sub.value, isAsset);

  return (
    <div className="group/item relative flex flex-col justify-center min-h-[44px]">
      <AnimatePresence>
        {isDeleting && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 z-10 bg-surface/95 backdrop-blur-sm flex items-center justify-between px-2 rounded-lg border border-accent-red/20"
          >
            <span className="text-sm font-bold text-accent-red truncate pr-4">Delete "{sub.name}"?</span>
            <div className="flex gap-2 shrink-0">
              <button onClick={() => setIsDeleting(false)} className="px-3 py-1 text-xs font-bold text-text-muted hover:bg-text/10 rounded-md transition-colors">Cancel</button>
              <button onClick={() => onDelete(sub.id)} className="px-3 py-1 text-xs font-bold bg-accent-red text-white rounded-md hover:brightness-110 transition-colors">Delete</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex justify-between items-center text-sm mb-1.5">
        <div className="flex items-center gap-2 overflow-hidden pr-4">
          <button onClick={() => onSelect(sub.id, sub.name)} className="font-semibold text-text-muted text-left hover:text-primary transition-colors truncate">
            {sub.name}
          </button>
          {!isAsset && <span className="text-[9px] bg-accent-red/10 text-accent-red px-1.5 py-0.5 rounded font-extrabold uppercase tracking-widest shrink-0">Debt</span>}
        </div>
        
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-center gap-2.5">
            <span title="% of category total" className="text-[11px] font-semibold text-text-muted opacity-70 w-10 text-right cursor-help">
              {subPercentage.toFixed(1)}%
            </span>
            <span className={`font-mono font-bold w-24 text-right ${isAsset ? 'text-text' : 'text-accent-red'}`}>
              {formatCurrency(displayValue)}
            </span>
          </div>
          
          <div className="flex opacity-40 group-hover/item:opacity-100 transition-opacity duration-200">
            <button onClick={() => onEdit(sub)} aria-label="Edit item" className="text-text-muted hover:text-primary hover:bg-primary/10 p-1 rounded-md transition-colors">
              <PencilSquareIcon className="w-4 h-4" />
            </button>
            <button onClick={() => setIsDeleting(true)} aria-label="Delete item" className="text-text-muted hover:text-accent-red hover:bg-accent-red/10 p-1 rounded-md transition-colors">
              <TrashIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
      
      <div className="w-full bg-text/5 rounded-full h-1.5 overflow-hidden">
        <motion.div initial={{ width: 0 }} animate={{ width: `${subPercentage}%` }} transition={{ duration: 0.4, ease: "easeOut" }} className={`rounded-full h-full ${bgClass}`} />
      </div>
    </div>
  );
};

// ==========================================
// SUB-COMPONENT 3: Batch Editor (Spreadsheet)
// ==========================================
const BatchEditor = ({ category, isAsset, onSave, onCancel }) => {
  const [batchData, setBatchData] = useState(() => {
    const initial = {};
    category.subcategories.forEach(sub => initial[sub.id] = { name: sub.name, value: Math.abs(sub.value) });
    return initial;
  });
  
  const [isDirty, setIsDirty] = useState(false);

  const handleBatchChange = (id, field, value) => {
    setIsDirty(true);
    setBatchData(prev => ({ ...prev, [id]: { ...prev[id], [field]: value } }));
  };

  const handleCancel = () => {
    if (isDirty && !window.confirm("You have unsaved changes. Discard them?")) return;
    onCancel();
  };

  const handleSave = () => {
    const updatedSubs = category.subcategories.map(sub => {
      const draft = batchData[sub.id];
      if (!draft) return sub;
      return { 
        ...sub, 
        name: draft.name.trim() || sub.name, 
        value: FinancialMath.toStorage(draft.value, isAsset) 
      };
    });
    onSave(updatedSubs);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: -15, scale: 0.98 }} 
      animate={{ opacity: 1, y: 0, scale: 1 }} 
      // THE MICRO-INTERACTION FIX: Beautiful spring physics bounce 
      transition={{ type: "spring", bounce: 0.4, duration: 0.6 }}
      className="space-y-3 origin-top"
    >
      <div className="flex px-2 text-[10px] font-bold text-text-muted uppercase tracking-widest mb-2 border-b border-text/5 pb-2">
        <div className="flex-1">Account Name</div>
        <div className="w-32 text-right pr-2">Balance</div>
      </div>
      
      {category.subcategories.map((sub, index) => (
        <div key={sub.id} className="flex items-center gap-3">
          <input 
            value={batchData[sub.id]?.name || ''} aria-label="Account Name" onChange={e => handleBatchChange(sub.id, 'name', e.target.value)}
            onKeyDown={e => { if(e.key === 'Enter') handleSave(); if(e.key === 'Escape') handleCancel(); }}
            className="flex-1 bg-surface border border-text/10 focus:border-primary focus:ring-1 focus:ring-primary rounded-lg px-3 py-2 text-sm font-semibold outline-none transition-all"
          />
          <div className="relative w-36">
            <span className="absolute left-3 top-2 text-text-muted font-bold text-sm">{isAsset ? '$' : '-$'}</span>
            <input 
              type="number" step="0.01" aria-label="Account Balance" value={batchData[sub.id]?.value || ''} onChange={e => handleBatchChange(sub.id, 'value', e.target.value)}
              onKeyDown={e => { if(e.key === 'Enter') handleSave(); if(e.key === 'Escape') handleCancel(); }} autoFocus={index === 0}
              className={`w-full bg-surface border border-text/10 focus:border-primary focus:ring-1 focus:ring-primary rounded-lg pl-7 pr-3 py-2 text-sm font-mono font-bold text-right outline-none transition-all ${!isAsset && 'text-accent-red'}`}
            />
          </div>
        </div>
      ))}

      <div className="flex justify-end items-center gap-4 pt-2 mt-4">
        {isDirty && <span className="text-xs font-semibold text-accent-red animate-pulse">Unsaved edits</span>}
        <button onClick={handleCancel} className="px-4 py-2 text-sm font-bold text-text-muted hover:text-text bg-text/5 hover:bg-text/10 rounded-xl transition-colors">Cancel</button>
        <button onClick={handleSave} className="px-5 py-2 text-sm font-bold text-background bg-primary hover:brightness-110 rounded-xl transition-all flex items-center gap-2"><CheckIcon className="w-4 h-4" /> Save All</button>
      </div>
    </motion.div>
  );
};

// ==========================================
// MAIN COMPONENT: Category Card
// ==========================================
const CategoryCard = ({ category, groupTotal = 0, onUpdateCategory, onDeleteCategory, onSelectCategory, onSelectSubcategory }) => {
  const isAsset = category.type === 'asset';
  const colorClass = isAsset ? 'text-accent-green' : 'text-accent-red';
  const bgClass = isAsset ? 'bg-accent-green' : 'bg-accent-red';
  
  const categoryTotal = FinancialMath.sumCategory(category.subcategories);
  const displayTotal = FinancialMath.toDisplay(categoryTotal, isAsset);
  const categoryPercentage = groupTotal > 0 ? (categoryTotal / groupTotal) * 100 : 0;

  const [isExpanded, setIsExpanded] = useState(true);
  const [editingCatName, setEditingCatName] = useState(false);
  const [catNameInput, setCatNameInput] = useState(category.name);

  const [addingSub, setAddingSub] = useState(false);
  const [newSub, setNewSub] = useState({ name: '', value: '' });

  const [editingSubId, setEditingSubId] = useState(null);
  const [editSubData, setEditSubData] = useState({ name: '', value: '' });

  const [isBatchEditing, setIsBatchEditing] = useState(false);
  const [isDeletingCategory, setIsDeletingCategory] = useState(false);

  const handleSaveCatName = () => {
    if (catNameInput.trim()) onUpdateCategory({ ...category, name: catNameInput.trim() });
    else setCatNameInput(category.name);
    setEditingCatName(false);
  };

  const handleSaveNewSub = () => {
    if (!newSub.name.trim() || newSub.value === '') return;
    const finalValue = FinancialMath.toStorage(newSub.value, isAsset);
    onUpdateCategory({ ...category, subcategories: [...category.subcategories, { id: `sub_${Date.now()}`, name: newSub.name.trim(), value: finalValue }] });
    setAddingSub(false); setNewSub({ name: '', value: '' });
  };

  const handleSaveEditSub = () => {
    if (!editSubData.name.trim() || editSubData.value === '') return;
    const finalValue = FinancialMath.toStorage(editSubData.value, isAsset);
    const updatedSubs = category.subcategories.map(s => s.id === editingSubId ? { ...s, name: editSubData.name.trim(), value: finalValue } : s);
    onUpdateCategory({ ...category, subcategories: updatedSubs });
    setEditingSubId(null);
  };

  return (
    <motion.div layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} 
      className={`premium-card p-0 overflow-hidden group/card transition-all duration-300 ${isBatchEditing ? 'border-primary/40' : 'border border-text/5 hover:border-text/10'}`}
    >
      {/* HEADER SECTION */}
      <div 
        onClick={() => !isBatchEditing && !isDeletingCategory && setIsExpanded(!isExpanded)}
        onKeyDown={(e) => {
          if (!isBatchEditing && !isDeletingCategory && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault();
            setIsExpanded(!isExpanded);
          }
        }}
        aria-expanded={isExpanded}
        role="button"
        tabIndex={0}
        className={`flex justify-between items-center p-5 select-none transition-colors duration-300 ${isBatchEditing ? 'border-b border-text/5 bg-surface cursor-default' : isExpanded ? 'border-b border-text/5 bg-surface cursor-pointer' : 'bg-text/[0.02] hover:bg-text/[0.04] cursor-pointer'}`}
      >
        <div className="flex-1">
          {editingCatName ? (
            <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
              <input autoFocus aria-label="Category Name" value={catNameInput} onChange={e => setCatNameInput(e.target.value)} onKeyDown={e => { if(e.key === 'Enter') handleSaveCatName(); if(e.key === 'Escape') setEditingCatName(false); }} className="bg-background border border-primary/30 rounded-lg px-3 py-1.5 text-lg font-bold text-text outline-none focus:border-primary transition-colors w-full max-w-[240px] shadow-sm" />
              <button onClick={handleSaveCatName} className="text-primary bg-primary/10 hover:bg-primary hover:text-background p-1.5 rounded-lg transition-colors"><CheckIcon className="w-5 h-5"/></button>
              <button onClick={() => setEditingCatName(false)} className="text-text-muted hover:bg-text/10 hover:text-text p-1.5 rounded-lg transition-colors"><XMarkIcon className="w-5 h-5"/></button>
            </div>
          ) : isBatchEditing ? (
            <div className="flex flex-col items-start">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-primary mb-1">Batch Editing Mode</span>
              <div className="text-xl font-bold text-text flex items-center gap-2">{category.name}</div>
            </div>
          ) : (
            <div className="flex flex-col items-start">
              <button onClick={(e) => { e.stopPropagation(); onSelectCategory(category.id, category.name); }} className="text-xl font-bold text-text text-left hover:text-primary transition-colors disabled:pointer-events-none" disabled={isDeletingCategory} title="View Category Trend">
                {category.name}
              </button>
              <div className="flex items-center gap-3 mt-0.5">
                <p className={`font-mono text-lg font-extrabold ${colorClass}`}>{formatCurrency(displayTotal)}</p>
                {groupTotal > 0 && <span title="% of total portfolio" className="text-[10px] font-bold text-text-muted uppercase tracking-wider bg-text/5 px-2 py-0.5 rounded-md border border-text/5 cursor-help">{categoryPercentage.toFixed(1)}% of Total</span>}
              </div>
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-2 sm:gap-4 pl-4">
          {isDeletingCategory ? (
            <div className="flex items-center gap-2 shrink-0" onClick={e => e.stopPropagation()}>
              <span className="text-sm font-bold text-accent-red hidden sm:inline-block mr-2">Delete category?</span>
              <button onClick={() => setIsDeletingCategory(false)} className="px-3 py-1.5 text-xs font-bold text-text-muted hover:bg-text/10 rounded-lg transition-colors">Cancel</button>
              <button onClick={() => onDeleteCategory(category.id)} className="px-3 py-1.5 text-xs font-bold bg-accent-red text-white rounded-lg hover:brightness-110 transition-colors">Delete</button>
            </div>
          ) : !editingCatName && !isBatchEditing && (
            <div className="flex gap-1 items-center">
              <button onClick={(e) => { e.stopPropagation(); setAddingSub(true); setIsExpanded(true); }} aria-label="Add Item" className="p-2 rounded-xl text-primary bg-primary/5 hover:bg-primary/15 transition-colors font-bold flex items-center gap-1.5">
                <PlusCircleIcon className="w-5 h-5" /> <span className="hidden sm:inline text-sm">Add</span>
              </button>
              
              <div className="h-5 w-px bg-text/10 mx-1 hidden sm:block"></div>
              
              <CategoryMenu onEdit={() => setEditingCatName(true)} onDeleteRequest={() => setIsDeletingCategory(true)} />
            </div>
          )}
          
          {!isBatchEditing && !isDeletingCategory && (
            <>
              <div className="h-6 w-px bg-text/10 mx-1 hidden sm:block"></div>
              <div className={`p-1.5 rounded-xl transition-transform duration-300 text-text-muted ${isExpanded ? 'rotate-180' : ''}`}><ChevronDownIcon className="w-5 h-5" /></div>
            </>
          )}
        </div>
      </div>

      {/* SUBCATEGORIES LIST CONTAINER */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden bg-background/30">
            <div className="p-5 space-y-4">
              
              {!isBatchEditing && category.subcategories.length > 0 && (
                <div className="flex justify-end mb-2">
                   <button onClick={() => setIsBatchEditing(true)} className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-text-muted hover:text-primary bg-text/5 hover:bg-primary/10 px-3 py-1.5 rounded-lg transition-colors">
                     <TableCellsIcon className="w-4 h-4" /> Edit All Items
                   </button>
                </div>
              )}

              {isBatchEditing ? (
                <BatchEditor category={category} isAsset={isAsset} onCancel={() => setIsBatchEditing(false)} onSave={(updated) => { onUpdateCategory({ ...category, subcategories: updated }); setIsBatchEditing(false); }} />
              ) : (
                <>
                  {category.subcategories.map((sub) => {
                    if (editingSubId === sub.id) {
                      return (
                        <div key={sub.id} className="flex items-center gap-2 mb-2 bg-text/5 p-2 rounded-xl border border-text/10 shadow-inner">
                          <input autoFocus aria-label="Edit Name" value={editSubData.name} onChange={e => setEditSubData({...editSubData, name: e.target.value})} onKeyDown={e => { if(e.key === 'Enter') handleSaveEditSub(); if(e.key === 'Escape') setEditingSubId(null); }} className="flex-1 bg-surface border border-transparent focus:border-primary rounded-lg px-3 py-1.5 text-sm font-semibold outline-none transition-colors" />
                          <div className="relative w-32">
                            <span className="absolute left-3 top-1.5 text-text-muted font-bold text-sm">{isAsset ? '$' : '-$'}</span>
                            <input type="number" aria-label="Edit Value" step="0.01" value={editSubData.value} onChange={e => setEditSubData({...editSubData, value: e.target.value})} onKeyDown={e => { if(e.key === 'Enter') handleSaveEditSub(); if(e.key === 'Escape') setEditingSubId(null); }} className={`w-full bg-surface border border-transparent focus:border-primary rounded-lg pl-7 pr-2 py-1.5 text-sm font-mono font-bold outline-none transition-colors ${!isAsset && 'text-accent-red'}`} />
                          </div>
                          <button onClick={handleSaveEditSub} className="text-primary bg-primary/10 hover:bg-primary hover:text-background p-1.5 rounded-lg transition-colors"><CheckIcon className="w-5 h-5"/></button>
                          <button onClick={() => setEditingSubId(null)} className="text-text-muted hover:bg-text/10 hover:text-text p-1.5 rounded-lg transition-colors"><XMarkIcon className="w-5 h-5"/></button>
                        </div>
                      );
                    }
                    return <SubcategoryRow key={sub.id} sub={sub} categoryTotal={categoryTotal} isAsset={isAsset} bgClass={bgClass} onSelect={onSelectSubcategory} onEdit={(sub) => { setEditingSubId(sub.id); setEditSubData({ name: sub.name, value: Math.abs(sub.value) }); }} onDelete={(id) => onUpdateCategory({ ...category, subcategories: category.subcategories.filter(s => s.id !== id) })} />;
                  })}

                  {addingSub && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="flex items-center gap-2 mt-4 bg-primary/5 p-2 rounded-xl border border-primary/20 shadow-inner">
                      <input autoFocus aria-label="New Item Name" placeholder="New Item Name" value={newSub.name} onChange={e => setNewSub({...newSub, name: e.target.value})} onKeyDown={e => { if(e.key === 'Enter') handleSaveNewSub(); if(e.key === 'Escape') setAddingSub(false); }} className="flex-1 bg-surface border border-transparent focus:border-primary rounded-lg px-3 py-1.5 text-sm font-semibold outline-none transition-colors" />
                      <div className="relative w-32">
                        <span className="absolute left-3 top-1.5 text-text-muted font-bold text-sm">{isAsset ? '$' : '-$'}</span>
                        <input type="number" aria-label="New Item Value" step="0.01" placeholder="0.00" value={newSub.value} onChange={e => setNewSub({...newSub, value: e.target.value})} onKeyDown={e => { if(e.key === 'Enter') handleSaveNewSub(); if(e.key === 'Escape') setAddingSub(false); }} className={`w-full bg-surface border border-transparent focus:border-primary rounded-lg pl-7 pr-2 py-1.5 text-sm font-mono font-bold outline-none transition-colors ${!isAsset && 'text-accent-red'}`} />
                      </div>
                      <button onClick={handleSaveNewSub} className="text-primary bg-primary/10 hover:bg-primary hover:text-background p-1.5 rounded-lg transition-colors"><CheckIcon className="w-5 h-5"/></button>
                      <button onClick={() => setAddingSub(false)} className="text-text-muted hover:bg-text/10 hover:text-text p-1.5 rounded-lg transition-colors"><XMarkIcon className="w-5 h-5"/></button>
                    </motion.div>
                  )}
                  
                  {!addingSub && category.subcategories.length === 0 && (
                    <button onClick={() => setAddingSub(true)} className="w-full py-8 flex flex-col items-center justify-center gap-2 border-2 border-dashed border-text/10 rounded-2xl text-text-muted hover:text-primary hover:border-primary/30 hover:bg-primary/5 transition-all group/empty mt-2">
                      <PlusCircleIcon className="w-8 h-8 opacity-50 group-hover/empty:opacity-100 group-hover/empty:scale-110 transition-all" />
                      <span className="text-sm font-bold tracking-wide">Click to add your first {isAsset ? 'asset' : 'liability'}</span>
                    </button>
                  )}
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default CategoryCard;