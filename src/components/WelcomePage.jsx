// src/components/WelcomePage.jsx
import React, { useState } from 'react';
import { ChartBarIcon, DocumentPlusIcon, ChartPieIcon, ArrowTrendingUpIcon } from '@heroicons/react/24/outline';

const Feature = ({ icon: Icon, title, children }) => (
  <div className="flex gap-4">
    <div className="flex-shrink-0 h-12 w-12 bg-surface rounded-lg flex items-center justify-center border border-text/10">
      <Icon className="w-6 h-6 text-primary" />
    </div>
    <div>
      <h3 className="font-bold text-text">{title}</h3>
      <p className="text-text-muted text-sm">{children}</p>
    </div>
  </div>
);

const WelcomePage = ({ onComplete }) => {
  const [name, setName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) {
      onComplete(name.trim());
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-text mb-2">Welcome to Your Financial Dashboard!</h1>
          <p className="text-lg text-text-muted">Let's get you set up. What should we call you?</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div className="bg-surface p-8 rounded-xl border border-text/10 shadow-lg">
            <form onSubmit={handleSubmit}>
              <label htmlFor="name" className="block text-sm font-medium text-text-muted mb-2">
                Enter your first name
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Alex"
                className="w-full p-3 border rounded-lg bg-background border-text/20 text-text focus:ring-2 focus:ring-primary focus:border-primary"
                required
              />
              <button
                type="submit"
                className="w-full mt-6 py-3 bg-primary text-background font-bold rounded-lg hover:bg-primary-dark transition-colors text-lg"
              >
                Get Started
              </button>
            </form>
          </div>

          <div className="space-y-6">
            <Feature icon={DocumentPlusIcon} title="Track Everything">
              Add snapshots of your finances over time. Edit, add, or delete any category to match your life.
            </Feature>
            <Feature icon={ChartBarIcon} title="Visualize Your Progress">
              See your net worth grow with an interactive chart. Understand your asset allocation at a glance.
            </Feature>
            <Feature icon={ArrowTrendingUpIcon} title="Gain Key Insights">
              Discover your "Biggest Movers" between snapshots to see what's driving change in your finances.
            </Feature>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;