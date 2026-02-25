// src/components/forms/GoalForm.jsx
import React, { useState } from 'react';
import { HomeIcon, AcademicCapIcon, TrophyIcon, SparklesIcon, RocketLaunchIcon, BanknotesIcon } from '@heroicons/react/24/outline';

const ICON_OPTIONS = [
  { name: 'TrophyIcon', component: TrophyIcon },
  { name: 'HomeIcon', component: HomeIcon },
  { name: 'AcademicCapIcon', component: AcademicCapIcon },
  { name: 'RocketLaunchIcon', component: RocketLaunchIcon },
  { name: 'SparklesIcon', component: SparklesIcon },
  { name: 'BanknotesIcon', component: BanknotesIcon },
];

const COLOR_OPTIONS = [
  { name: 'Cyan', class: 'bg-primary' },
  { name: 'Green', class: 'bg-accent-green' },
  { name: 'Purple', class: 'bg-purple-500' },
  { name: 'Pink', class: 'bg-pink-500' },
  { name: 'Amber', class: 'bg-amber-500' },
];

const GoalForm = ({ onSubmit, initialData, onCancel }) => {
  const [name, setName] = useState(initialData?.name || '');
  const [targetAmount, setTargetAmount] = useState(initialData?.targetAmount || '');
  const [currentAmount, setCurrentAmount] = useState(initialData?.currentAmount || 0);
  const [isNetWorthLinked, setIsNetWorthLinked] = useState(initialData?.isNetWorthLinked || false);
  const [selectedIcon, setSelectedIcon] = useState(initialData?.icon || 'TrophyIcon');
  const [selectedColor, setSelectedColor] = useState(initialData?.color || 'bg-primary');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // THE FIX: Strip out commas, dollar signs, and letters so the user can type freely
    const cleanTarget = targetAmount.toString().replace(/[^0-9.]/g, '');
    const cleanCurrent = currentAmount.toString().replace(/[^0-9.]/g, '');
    
    const safeTargetAmount = parseFloat(cleanTarget) || 0;
    const safeCurrentAmount = parseFloat(cleanCurrent) || 0;

    // Safety check: ensure they don't submit a $0 goal
    if (safeTargetAmount <= 0) {
      alert("Please enter a valid target amount greater than 0.");
      return;
    }

    // This data is perfectly formatted and will now successfully trigger the Firebase hook
    onSubmit({
      id: initialData?.id || `goal_${Date.now()}`,
      name,
      targetAmount: safeTargetAmount,
      currentAmount: isNetWorthLinked ? 0 : safeCurrentAmount,
      isNetWorthLinked,
      icon: selectedIcon,
      color: selectedColor
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-semibold text-text-muted mb-2">Goal Name</label>
        <input 
          autoFocus 
          type="text" 
          required 
          value={name} 
          onChange={e => setName(e.target.value)} 
          placeholder="e.g. Dream House" 
          className="w-full bg-background border border-text/10 rounded-xl px-4 py-3 text-text outline-none focus:border-primary transition-colors" 
        />
      </div>

      <div className="flex items-center justify-between p-4 bg-text/5 rounded-xl border border-text/10">
        <div>
          <h4 className="font-bold text-text text-sm">Link to Total Net Worth?</h4>
          <p className="text-xs text-text-muted mt-1">Automatically tracks your overall net worth instead of manual savings.</p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input 
            type="checkbox" 
            className="sr-only peer" 
            checked={isNetWorthLinked} 
            onChange={() => setIsNetWorthLinked(!isNetWorthLinked)} 
          />
          <div className="w-11 h-6 bg-text/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
        </label>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-text-muted mb-2">Target Amount ($)</label>
          {/* Changed type="number" to type="text" to prevent silent browser crashes on commas */}
          <input 
            type="text" 
            required 
            placeholder="100000"
            value={targetAmount} 
            onChange={e => setTargetAmount(e.target.value)} 
            className="w-full bg-background border border-text/10 rounded-xl px-4 py-3 text-text outline-none focus:border-primary font-mono transition-colors" 
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-text-muted mb-2">Currently Saved ($)</label>
          <input 
            type="text" 
            disabled={isNetWorthLinked} 
            value={isNetWorthLinked ? 'Auto-Linked' : currentAmount} 
            onChange={e => setCurrentAmount(e.target.value)} 
            className="w-full bg-background border border-text/10 rounded-xl px-4 py-3 text-text outline-none focus:border-primary font-mono transition-colors disabled:opacity-50 disabled:bg-text/5 disabled:cursor-not-allowed" 
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-text-muted mb-3">Style & Icon</label>
        <div className="flex items-center gap-4 mb-4">
          {COLOR_OPTIONS.map(color => (
            <button 
              key={color.name} 
              type="button" 
              onClick={() => setSelectedColor(color.class)} 
              className={`w-8 h-8 rounded-full ${color.class} ${selectedColor === color.class ? 'ring-4 ring-offset-2 ring-offset-surface ring-primary/50' : 'opacity-50'}`} 
            />
          ))}
        </div>
        <div className="flex gap-3 flex-wrap">
          {ICON_OPTIONS.map(({ name: iconName, component: Icon }) => (
            <button 
              key={iconName} 
              type="button" 
              onClick={() => setSelectedIcon(iconName)} 
              className={`p-3 rounded-xl border transition-all ${selectedIcon === iconName ? 'bg-text/10 border-text/20 text-text' : 'border-transparent text-text-muted hover:bg-text/5'}`}
            >
              <Icon className="w-6 h-6" />
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-text/5 mt-6">
        <button 
          type="button" 
          onClick={onCancel} 
          className="px-5 py-2.5 rounded-xl text-text-muted hover:bg-text/5 font-semibold transition-colors"
        >
          Cancel
        </button>
        <button 
          type="submit" 
          className="px-5 py-2.5 bg-primary text-background rounded-xl font-bold hover:bg-primary-dark transition-colors shadow-lg shadow-primary/20"
        >
          Save Goal
        </button>
      </div>
    </form>
  );
};

export default GoalForm;