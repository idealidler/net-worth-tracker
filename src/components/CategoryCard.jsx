// src/components/CategoryCard.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { PencilSquareIcon, TrashIcon, PlusCircleIcon } from '@heroicons/react/24/outline';

const formatCurrency = (value) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);

const CategoryCard = ({ category, onAddSub, onEditCat, onDeleteCat, onEditSub, onDeleteSub, onSelectCategory, onSelectSubcategory }) => {
  const categoryTotal = category.subcategories.reduce((sum, sub) => sum + Math.abs(sub.value), 0);
  
  const isAsset = category.type === 'asset';
  const colorClass = isAsset ? 'text-accent-green' : 'text-accent-red';
  const bgClass = isAsset ? 'bg-accent-green' : 'bg-accent-red';
  
  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      // We removed the messy inline Tailwind here and replaced it with our clean new utility!
      className="premium-card group/card"
    >
      {/* Header Section */}
      <div className="flex justify-between items-start mb-5 border-b border-text/5 pb-4">
        <div>
          <button 
            onClick={() => onSelectCategory(category.id, category.name)} 
            className="text-lg font-bold text-text text-left hover:text-primary transition-colors flex items-center gap-2"
          >
            {category.name}
          </button>
          <p className={`font-mono text-sm font-semibold mt-1 ${colorClass}`}>
            {formatCurrency(categoryTotal)}
          </p>
        </div>
        
        {/* Category Actions */}
        <div className="flex gap-2 opacity-40 group-hover/card:opacity-100 transition-opacity">
          <button onClick={onAddSub} className="p-1.5 bg-text/5 rounded-xl text-text-muted hover:text-primary hover:bg-primary/10 transition-colors" title="Add Item">
            <PlusCircleIcon className="w-5 h-5" />
          </button>
          <button onClick={onEditCat} className="p-1.5 bg-text/5 rounded-xl text-text-muted hover:text-primary hover:bg-primary/10 transition-colors" title="Edit Category">
            <PencilSquareIcon className="w-5 h-5" />
          </button>
          <button onClick={onDeleteCat} className="p-1.5 bg-text/5 rounded-xl text-text-muted hover:text-accent-red hover:bg-accent-red/10 transition-colors" title="Delete Category">
            <TrashIcon className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Subcategories List */}
      <div className="space-y-5">
        {category.subcategories.map((sub, index) => {
          const subPercentage = categoryTotal > 0 ? (Math.abs(sub.value) / categoryTotal) * 100 : 0;
          
          return (
            <div key={sub.id} className="group/item">
              <div className="flex justify-between text-sm mb-2">
                <button 
                  onClick={() => onSelectSubcategory(sub.id, sub.name)} 
                  className="font-medium text-text-muted text-left hover:text-primary transition-colors truncate pr-4"
                >
                  {sub.name}
                </button>
                
                <div className="flex items-center gap-3 shrink-0">
                   <span className="font-mono font-medium text-text">
                     {formatCurrency(Math.abs(sub.value))}
                   </span>
                   
                   <div className="flex opacity-0 -translate-x-2 group-hover/item:opacity-100 group-hover/item:translate-x-0 transition-all">
                      <button onClick={() => onEditSub(sub)} className="text-text-muted hover:text-primary p-1">
                        <PencilSquareIcon className="w-4 h-4" />
                      </button>
                      <button onClick={() => onDeleteSub(sub.id)} className="text-text-muted hover:text-accent-red p-1">
                        <TrashIcon className="w-4 h-4" />
                      </button>
                   </div>
                </div>
              </div>
              
              <div className="w-full bg-text/5 rounded-full h-1.5 overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${subPercentage}%` }}
                  transition={{ duration: 0.8, delay: index * 0.1, ease: "easeOut" }}
                  className={`rounded-full h-full ${bgClass}`} 
                />
              </div>
            </div>
          );
        })}
        
        {/* 1% Upgrade: Actionable Empty State */}
        {category.subcategories.length === 0 && (
          <button 
            onClick={onAddSub}
            className="w-full py-6 flex flex-col items-center justify-center gap-2 border-2 border-dashed border-text/10 rounded-2xl text-text-muted hover:text-primary hover:border-primary/30 hover:bg-primary/5 transition-all group/empty"
          >
            <PlusCircleIcon className="w-8 h-8 opacity-50 group-hover/empty:opacity-100 group-hover/empty:scale-110 transition-all" />
            <span className="text-sm font-medium">Click to add your first {isAsset ? 'asset' : 'liability'}</span>
          </button>
        )}
      </div>
    </motion.div>
  );
};

export default CategoryCard;