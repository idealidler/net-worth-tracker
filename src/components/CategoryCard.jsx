// src/components/CategoryCard.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { PencilSquareIcon, TrashIcon, PlusCircleIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';

const formatCurrency = (value) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);

const CategoryCard = ({ category, onUpdateCategory, onDeleteCategory, onSelectCategory, onSelectSubcategory }) => {
  const isAsset = category.type === 'asset';
  const colorClass = isAsset ? 'text-accent-green' : 'text-accent-red';
  const bgClass = isAsset ? 'bg-accent-green' : 'bg-accent-red';
  const categoryTotal = category.subcategories.reduce((sum, sub) => sum + Math.abs(sub.value), 0);

  // --- Inline Editing State ---
  const [editingCatName, setEditingCatName] = useState(false);
  const [catNameInput, setCatNameInput] = useState(category.name);

  const [addingSub, setAddingSub] = useState(false);
  const [newSub, setNewSub] = useState({ name: '', value: '' });

  const [editingSubId, setEditingSubId] = useState(null);
  const [editSubData, setEditSubData] = useState({ name: '', value: '' });

  // --- Handlers ---
  const handleSaveCatName = () => {
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
    if (e.key === 'Enter') saveAction();
    if (e.key === 'Escape') cancelAction();
  };

  return (
    <motion.div layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="premium-card group/card">
      
      {/* HEADER SECTION */}
      <div className="flex justify-between items-start mb-5 border-b border-text/5 pb-4">
        <div className="flex-1">
          {editingCatName ? (
            <div className="flex items-center gap-2">
              <input 
                autoFocus value={catNameInput} onChange={e => setCatNameInput(e.target.value)}
                onKeyDown={e => handleKeyDown(e, handleSaveCatName, () => setEditingCatName(false))}
                className="bg-background border border-text/10 rounded-lg px-3 py-1 text-lg font-bold text-text outline-none focus:border-primary transition-colors w-full max-w-[200px]"
              />
              <button onClick={handleSaveCatName} className="text-primary hover:bg-primary/10 p-1 rounded-md"><CheckIcon className="w-5 h-5"/></button>
              <button onClick={() => setEditingCatName(false)} className="text-text-muted hover:bg-text/10 p-1 rounded-md"><XMarkIcon className="w-5 h-5"/></button>
            </div>
          ) : (
            <>
              <button onClick={() => onSelectCategory(category.id, category.name)} className="text-lg font-bold text-text text-left hover:text-primary transition-colors">
                {category.name}
              </button>
              <p className={`font-mono text-sm font-semibold mt-1 ${colorClass}`}>{formatCurrency(categoryTotal)}</p>
            </>
          )}
        </div>
        
        {!editingCatName && (
          <div className="flex gap-2 opacity-40 group-hover/card:opacity-100 transition-opacity">
            <button onClick={() => setAddingSub(true)} className="p-1.5 bg-text/5 rounded-xl text-text-muted hover:text-primary hover:bg-primary/10 transition-colors" title="Add Item">
              <PlusCircleIcon className="w-5 h-5" />
            </button>
            <button onClick={() => setEditingCatName(true)} className="p-1.5 bg-text/5 rounded-xl text-text-muted hover:text-primary hover:bg-primary/10 transition-colors" title="Edit Category">
              <PencilSquareIcon className="w-5 h-5" />
            </button>
            <button onClick={onDeleteCategory} className="p-1.5 bg-text/5 rounded-xl text-text-muted hover:text-accent-red hover:bg-accent-red/10 transition-colors" title="Delete Category">
              <TrashIcon className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      {/* SUBCATEGORIES LIST */}
      <div className="space-y-4">
        {category.subcategories.map((sub, index) => {
          const subPercentage = categoryTotal > 0 ? (Math.abs(sub.value) / categoryTotal) * 100 : 0;
          const isEditingThis = editingSubId === sub.id;
          
          return (
            <div key={sub.id} className="group/item relative">
              {isEditingThis ? (
                // INLINE EDITING ROW
                <div className="flex items-center gap-2 mb-2 bg-text/5 p-2 rounded-xl border border-text/10">
                  <input 
                    autoFocus placeholder="Name" value={editSubData.name} onChange={e => setEditSubData({...editSubData, name: e.target.value})}
                    onKeyDown={e => handleKeyDown(e, handleSaveEditSub, () => setEditingSubId(null))}
                    className="flex-1 bg-background border border-text/10 rounded-lg px-3 py-1.5 text-sm outline-none focus:border-primary"
                  />
                  <div className="relative w-28">
                    <span className="absolute left-3 top-1.5 text-text-muted font-bold text-sm">$</span>
                    <input 
                      type="number" step="0.01" value={editSubData.value} onChange={e => setEditSubData({...editSubData, value: e.target.value})}
                      onKeyDown={e => handleKeyDown(e, handleSaveEditSub, () => setEditingSubId(null))}
                      className="w-full bg-background border border-text/10 rounded-lg pl-6 pr-2 py-1.5 text-sm font-mono outline-none focus:border-primary"
                    />
                  </div>
                  <button onClick={handleSaveEditSub} className="text-primary hover:bg-primary/10 p-1.5 rounded-lg"><CheckIcon className="w-5 h-5"/></button>
                  <button onClick={() => setEditingSubId(null)} className="text-text-muted hover:bg-text/10 p-1.5 rounded-lg"><XMarkIcon className="w-5 h-5"/></button>
                </div>
              ) : (
                // STANDARD DISPLAY ROW
                <>
                  <div className="flex justify-between text-sm mb-2">
                    <button onClick={() => onSelectSubcategory(sub.id, sub.name)} className="font-medium text-text-muted text-left hover:text-primary transition-colors truncate pr-4">
                      {sub.name}
                    </button>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="font-mono font-medium text-text">{formatCurrency(Math.abs(sub.value))}</span>
                      <div className="flex opacity-0 -translate-x-2 group-hover/item:opacity-100 group-hover/item:translate-x-0 transition-all">
                        <button onClick={() => { setEditingSubId(sub.id); setEditSubData({ name: sub.name, value: Math.abs(sub.value) }); }} className="text-text-muted hover:text-primary p-1">
                          <PencilSquareIcon className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDeleteSub(sub.id)} className="text-text-muted hover:text-accent-red p-1">
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="w-full bg-text/5 rounded-full h-1.5 overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${subPercentage}%` }} transition={{ duration: 0.8, delay: index * 0.1, ease: "easeOut" }} className={`rounded-full h-full ${bgClass}`} />
                  </div>
                </>
              )}
            </div>
          );
        })}

        {/* INLINE ADD NEW ITEM ROW */}
        {addingSub && (
           <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="flex items-center gap-2 mt-4 bg-primary/5 p-2 rounded-xl border border-primary/20">
             <input 
               autoFocus placeholder="New Item Name" value={newSub.name} onChange={e => setNewSub({...newSub, name: e.target.value})}
               onKeyDown={e => handleKeyDown(e, handleSaveNewSub, () => setAddingSub(false))}
               className="flex-1 bg-background border border-text/10 rounded-lg px-3 py-1.5 text-sm outline-none focus:border-primary"
             />
             <div className="relative w-28">
               <span className="absolute left-3 top-1.5 text-text-muted font-bold text-sm">$</span>
               <input 
                 type="number" step="0.01" placeholder="0.00" value={newSub.value} onChange={e => setNewSub({...newSub, value: e.target.value})}
                 onKeyDown={e => handleKeyDown(e, handleSaveNewSub, () => setAddingSub(false))}
                 className="w-full bg-background border border-text/10 rounded-lg pl-6 pr-2 py-1.5 text-sm font-mono outline-none focus:border-primary"
               />
             </div>
             <button onClick={handleSaveNewSub} className="text-primary hover:bg-primary/10 p-1.5 rounded-lg"><CheckIcon className="w-5 h-5"/></button>
             <button onClick={() => setAddingSub(false)} className="text-text-muted hover:bg-text/10 p-1.5 rounded-lg"><XMarkIcon className="w-5 h-5"/></button>
           </motion.div>
        )}
        
        {/* Actionable Empty State */}
        {!addingSub && category.subcategories.length === 0 && (
          <button onClick={() => setAddingSub(true)} className="w-full py-6 flex flex-col items-center justify-center gap-2 border-2 border-dashed border-text/10 rounded-2xl text-text-muted hover:text-primary hover:border-primary/30 hover:bg-primary/5 transition-all group/empty">
            <PlusCircleIcon className="w-8 h-8 opacity-50 group-hover/empty:opacity-100 group-hover/empty:scale-110 transition-all" />
            <span className="text-sm font-medium">Click to add your first {isAsset ? 'asset' : 'liability'}</span>
          </button>
        )}
      </div>
    </motion.div>
  );
};

export default CategoryCard;