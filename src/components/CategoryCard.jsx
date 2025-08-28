// src/components/CategoryCard.jsx
import React from 'react';
import { PencilSquareIcon, TrashIcon, PlusCircleIcon } from '@heroicons/react/24/outline';

const formatCurrency = (value) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);

const CategoryCard = ({ category, onAddSub, onEditCat, onDeleteCat, onEditSub, onDeleteSub, onSelectCategory, onSelectSubcategory }) => {
  const categoryTotal = category.subcategories.reduce((sum, sub) => sum + Math.abs(sub.value), 0);
  
  return (
    <div className="bg-surface border border-text/10 rounded-lg p-4 transition-all hover:border-primary/50">
      <div className="flex justify-between items-center mb-3">
        <button onClick={() => onSelectCategory(category.id, category.name)} className="font-bold text-text text-left hover:text-primary transition-colors">
          {category.name}
        </button>
        <div className="flex gap-2">
          <button onClick={onAddSub} className="text-text-muted hover:text-primary"><PlusCircleIcon className="w-5 h-5" /></button>
          <button onClick={onEditCat} className="text-text-muted hover:text-primary"><PencilSquareIcon className="w-5 h-5" /></button>
          <button onClick={onDeleteCat} className="text-text-muted hover:text-accent-red"><TrashIcon className="w-5 h-5" /></button>
        </div>
      </div>
      <div className="space-y-3">
        {category.subcategories.map(sub => (
          <div key={sub.id} className="group">
            <div className="flex justify-between text-sm mb-1">
              <button onClick={() => onSelectSubcategory(sub.id, sub.name)} className="text-text-muted text-left hover:text-primary transition-colors">
                {sub.name}
              </button>
              <div className="flex items-center gap-2">
                 <span className="font-mono text-text">{formatCurrency(sub.value)}</span>
                 <div className="flex opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => onEditSub(sub)} className="text-text-muted hover:text-primary"><PencilSquareIcon className="w-4 h-4" /></button>
                    <button onClick={() => onDeleteSub(sub.id)} className="text-text-muted hover:text-accent-red ml-1"><TrashIcon className="w-4 h-4" /></button>
                 </div>
              </div>
            </div>
            <div className="w-full bg-background rounded-full h-1.5">
              <div 
                className={`rounded-full h-1.5 ${category.type === 'asset' ? 'bg-accent-green' : 'bg-accent-red'}`} 
                style={{ width: `${(Math.abs(sub.value) / categoryTotal) * 100}%`}}
              ></div>
            </div>
          </div>
        ))}
        {category.subcategories.length === 0 && <p className="text-sm text-text-muted">No items yet.</p>}
      </div>
    </div>
  );
};

export default CategoryCard;