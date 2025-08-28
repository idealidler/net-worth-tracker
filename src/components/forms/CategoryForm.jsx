import React, { useState } from 'react';

const CategoryForm = ({ onSubmit, initialData = { name: '' }, onCancel }) => {
  const [name, setName] = useState(initialData.name);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ name });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Category Name"
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

export default CategoryForm;