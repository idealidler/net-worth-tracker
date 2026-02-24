// src/components/forms/CategoryForm.jsx
import React, { useState } from 'react';

const CategoryForm = ({ onSubmit, initialData = { name: '' }, onCancel }) => {
  const [name, setName] = useState(initialData.name);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ name });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="block text-sm font-semibold text-text-muted mb-2">Category Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g., Real Estate, Student Loans..."
          className="w-full px-4 py-3 rounded-xl bg-background border border-text/10 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-text"
          required
          autoFocus
        />
      </div>
      
      <div className="flex justify-end gap-3 pt-2">
        <button type="button" onClick={onCancel} className="px-5 py-2.5 rounded-xl font-medium text-text-muted hover:bg-text/5 hover:text-text transition-colors">
          Cancel
        </button>
        <button type="submit" className="px-5 py-2.5 rounded-xl bg-primary text-background font-bold hover:bg-primary-dark hover:shadow-lg transition-all transform hover:-translate-y-0.5">
          Save Category
        </button>
      </div>
    </form>
  );
};

export default CategoryForm;