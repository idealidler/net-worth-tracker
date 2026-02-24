// src/components/forms/SubcategoryForm.jsx
import React, { useState } from 'react';

const SubcategoryForm = ({ onSubmit, initialData = { name: '', value: '' }, onCancel, assetType }) => {
  const [name, setName] = useState(initialData.name);
  // Show absolute value in the input field so users don't have to type negative signs
  const [value, setValue] = useState(initialData.value !== '' ? Math.abs(initialData.value) : '');

  const handleSubmit = (e) => {
    e.preventDefault();
    const numericValue = parseFloat(value);
    if (!isNaN(numericValue)) {
      onSubmit({ name, value: assetType === 'liability' ? -Math.abs(numericValue) : Math.abs(numericValue) });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="block text-sm font-semibold text-text-muted mb-2">Item Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g., Checking Account, Chase Sapphire..."
          className="w-full px-4 py-3 rounded-xl bg-background border border-text/10 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-text"
          required
          autoFocus
        />
      </div>
      
      <div>
        <label className="text-sm font-semibold text-text-muted mb-2 flex justify-between">
          Current Value 
          {assetType === 'liability' && <span className="text-accent-red font-normal italic">(Tracked as debt)</span>}
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <span className="text-text-muted font-bold">$</span>
          </div>
          <input
            type="number"
            step="0.01"
            min="0"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="0.00"
            className="w-full pl-8 pr-4 py-3 rounded-xl bg-background border border-text/10 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-text font-mono"
            required
          />
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <button type="button" onClick={onCancel} className="px-5 py-2.5 rounded-xl font-medium text-text-muted hover:bg-text/5 hover:text-text transition-colors">
          Cancel
        </button>
        <button type="submit" className="px-5 py-2.5 rounded-xl bg-primary text-background font-bold hover:bg-primary-dark hover:shadow-lg transition-all transform hover:-translate-y-0.5">
          Save Item
        </button>
      </div>
    </form>
  );
};

export default SubcategoryForm;