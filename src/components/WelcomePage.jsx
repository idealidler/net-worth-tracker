// src/components/WelcomePage.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChartBarIcon, DocumentPlusIcon, ArrowTrendingUpIcon } from '@heroicons/react/24/outline';

// Extracted Feature into a beautifully animated mini-card
const Feature = ({ icon: Icon, title, children, delay }) => (
  <motion.div 
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay, duration: 0.5 }}
    className="flex gap-5 p-5 bg-surface border border-text/5 rounded-3xl hover:shadow-md transition-all group"
  >
    <div className="flex-shrink-0 h-14 w-14 bg-primary/10 rounded-2xl flex items-center justify-center border border-text/5 group-hover:bg-primary/20 transition-colors">
      <Icon className="w-7 h-7 text-primary" />
    </div>
    <div>
      <h3 className="font-bold text-text text-lg mb-1">{title}</h3>
      <p className="text-text-muted text-sm leading-relaxed">{children}</p>
    </div>
  </motion.div>
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
    <div className="min-h-screen bg-background flex items-center justify-center p-6 relative overflow-hidden">
      {/* Subtle background glowing orb in bottom right */}
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-primary/10 blur-[150px] rounded-full pointer-events-none"></div>

      <div className="max-w-5xl w-full z-10 grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-center">
        
        {/* Left Column: Greeting & Form */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-8"
        >
          <div>
            <h1 className="text-4xl lg:text-5xl font-extrabold text-text mb-4 tracking-tight">
              Welcome to your<br/>
              <span className="text-primary">Financial Hub</span>
            </h1>
            <p className="text-lg text-text-muted font-medium">Let's personalize your experience. What should we call you?</p>
          </div>

          <form onSubmit={handleSubmit} className="bg-surface/80 backdrop-blur-xl p-8 rounded-3xl shadow-xl border border-text/5 space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-text-muted mb-3">
                Your First Name
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Alex"
                className="w-full px-5 py-4 rounded-xl bg-background border border-text/10 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-text text-lg"
                required
                autoFocus
              />
            </div>
            <button
              type="submit"
              className="w-full py-4 bg-primary text-background font-bold rounded-xl hover:bg-primary-dark hover:shadow-lg transition-all transform hover:-translate-y-0.5 text-lg"
            >
              Enter Dashboard
            </button>
          </form>
        </motion.div>

        {/* Right Column: Features List */}
        <div className="space-y-5">
          <Feature icon={DocumentPlusIcon} title="Track Everything" delay={0.2}>
            Add snapshots of your finances over time. Edit, add, or delete any category to match your life.
          </Feature>
          <Feature icon={ChartBarIcon} title="Visualize Your Progress" delay={0.4}>
            See your net worth grow with an interactive chart. Understand your asset allocation at a glance.
          </Feature>
          <Feature icon={ArrowTrendingUpIcon} title="Gain Key Insights" delay={0.6}>
            Discover your "Biggest Movers" between snapshots to see exactly what's driving change in your net worth.
          </Feature>
        </div>
        
      </div>
    </div>
  );
};

export default WelcomePage;