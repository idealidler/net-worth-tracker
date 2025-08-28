import React, { useState } from 'react';

const SubcategoryForm = ({ onSubmit, initialData = { name: '', value: '' }, onCancel, assetType }) => {
  const [name, setName] = useState(initialData.name);
  const [value, setValue] = useState(initialData.value);

  const handleSubmit = (e) => {
    e.preventDefault();
    const numericValue = parseFloat(value);
    if (!isNaN(numericValue)) {
      onSubmit({ name, value: assetType === 'liability' ? -Math.abs(numericValue) : Math.abs(numericValue) });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Subcategory Name"
        className="w-full p-2 border rounded bg-surface border-text/20 text-text mb-2"
        required
      />
      <input
        type="number"
        step="0.01"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Value"
        className="w-full p-2 border rounded bg-surface border-text/20 text-text"
        required
      />
      <div className="flex justify-end gap-2 mt-4">
        <button type="button" onClick={onCancel} className="px-4 py-2 rounded bg-text/20 text-text">Cancel</button>
        <button type="submit" className="px-4 py-2 rounded bg-primary text-background font-bold">Save</button>
      </div>
    </form>
  );
};

export default SubcategoryForm;