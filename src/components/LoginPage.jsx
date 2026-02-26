// src/components/Login.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import {
  BookOpenIcon,
  ClockIcon,
  ShieldCheckIcon,
  LockClosedIcon,
  ServerStackIcon,
  EnvelopeIcon,
  ChartBarIcon,
  SparklesIcon,
  TrophyIcon
} from '@heroicons/react/24/outline';

const Login = () => {
  const { signInWithGoogle } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const fullText = "Financial Clarity Over Time.";
  const splitIndex = "Financial Clarity".length;
  const [displayedText, setDisplayedText] = useState("");
  const [typingComplete, setTypingComplete] = useState(false);

  useEffect(() => {
    let index = 0;
    let timeout;

    const type = () => {
      if (index < fullText.length) {
        setDisplayedText(fullText.slice(0, index + 1));
        const isEndOfFirstLine = index === splitIndex - 1;
        const delay = isEndOfFirstLine ? 300 : 35;
        index++;
        timeout = setTimeout(type, delay);
      } else {
        setTypingComplete(true);
      }
    };

    type();
    return () => clearTimeout(timeout);
  }, []);

  const handleLogin = async () => {
    try {
      setIsLoading(true);
      setError('');
      await signInWithGoogle();
    } catch (err) {
      if (
        err?.code === 'auth/popup-closed-by-user' ||
        err?.code === 'auth/cancelled-popup-request'
      ) {
        setIsLoading(false);
        return;
      }

      setError('Sign-in failed. Please try again.');
      setIsLoading(false);
    }
  };

  const features = [
    {
      icon: BookOpenIcon,
      title: 'Structured Ledger',
      description: 'Organize assets and liabilities with flexible account modeling.'
    },
    {
      icon: ClockIcon,
      title: 'Time-Based Snapshots',
      description: 'Capture clean historical views of your financial position.'
    },
    {
      icon: ChartBarIcon,
      title: 'Long-Term Trends',
      description: 'See allocation shifts, growth patterns, and trajectory over time.'
    },
    {
      icon: SparklesIcon,
      title: 'Advanced Insights',
      description: 'Analyze wealth velocity, leverage risk, and your FIRE predictive runway.'
    },
    {
      icon: TrophyIcon,
      title: 'Goal Tracking',
      description: 'Set financial milestones auto-linked to your real-time net worth.'
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background text-text selection:bg-primary/30 font-sans relative">

      <div className="flex-1 flex flex-col lg:flex-row relative">

        {/* LEFT SIDE */}
        <div className="w-full lg:w-[55%] bg-surface flex flex-col justify-center px-8 sm:px-16 lg:px-24 py-16 lg:py-0 relative overflow-hidden">

          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgb(var(--color-text-muted)/0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgb(var(--color-text-muted)/0.02)_1px,transparent_1px)] bg-[size:40px_40px]" />
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent opacity-40 pointer-events-none" />

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative z-10 max-w-2xl"
          >
            <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight mb-8 leading-[1.05]">
              <span className="text-primary">
                {displayedText.slice(0, splitIndex)}
              </span>

              {displayedText.length > splitIndex && (
                <>
                  <br className="hidden sm:block" />
                  <span className="text-text-muted ml-1 sm:ml-0">
                    {displayedText.slice(splitIndex + 1)}
                  </span>
                </>
              )}

              {!typingComplete && (
                <motion.span
                  className="inline-block w-[1px] h-[1.1em] bg-primary ml-1 align-bottom"
                  animate={{ opacity: [1, 0.2, 1] }}
                  transition={{
                    duration: 1.8,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              )}
            </h1>

            <p className="text-lg sm:text-l text-text-muted leading-relaxed mb-10 max-w-xl">
              A private net worth dashboard built for long-term thinking. 
              Understand what you own, what you owe, and how it evolves.
            </p>

            {/* Tightened spacing here to fit all 5 features cleanly */}
            <div className="space-y-6">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, x: -10 }}
                  animate={typingComplete ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.5, delay: index * 0.12 }}
                  className="flex gap-5 items-start"
                >
                  <div className="w-11 h-11 rounded-xl bg-primary/5 flex items-center justify-center border border-primary/10 shrink-0">
                    <feature.icon className="w-5 h-5 text-primary/80" />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-text mb-1">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-text-muted leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* RIGHT SIDE */}
        <div className="w-full lg:w-[45%] flex flex-col items-center justify-center px-8 sm:px-16 py-16 relative bg-background">

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.25 }}
            className="w-full max-w-[460px]"
          >
            <div className="bg-surface border border-text/5 p-10 sm:p-12 rounded-3xl shadow-[0_20px_60px_rgb(0,0,0,0.06)] dark:shadow-[0_20px_60px_rgb(0,0,0,0.18)]">

              <div className="mb-8 text-center sm:text-left">
                <h2 className="text-2xl font-semibold text-text mb-2">
                  Access your dashboard
                </h2>
                <p className="text-sm text-text-muted">
                  Secure access using your Google account.
                </p>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-accent-red/10 border border-accent-red/20 rounded-xl text-accent-red text-sm font-medium">
                  {error}
                </div>
              )}

              <button
                onClick={handleLogin}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-3 bg-background border border-text/15 px-6 py-3.5 rounded-xl font-semibold text-sm text-text hover:bg-text/[0.04] hover:border-text/30 transition-all focus:outline-none focus:ring-4 focus:ring-primary/15 disabled:opacity-70 disabled:cursor-not-allowed shadow-sm hover:shadow-md active:scale-[0.99]"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-text/30 border-t-primary rounded-full animate-spin" />
                ) : (
                  <>
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                    </svg>
                    Continue with Google
                  </>
                )}
              </button>

              <div className="mt-6 text-xs text-text-muted space-y-3">
                <div className="flex items-start gap-2">
                  <LockClosedIcon className="w-4 h-4 mt-0.5" />
                  <span>Authentication handled by Google.</span>
                </div>
                <div className="flex items-start gap-2">
                  <ShieldCheckIcon className="w-4 h-4 mt-0.5" />
                  <span>Your financial data stays private.</span>
                </div>
                <div className="flex items-start gap-2">
                  <ServerStackIcon className="w-4 h-4 mt-0.5" />
                  <span>Encrypted in transit and at rest.</span>
                </div>
              </div>

            </div>
          </motion.div>
        </div>
      </div>

      <footer className="bg-surface border-t border-text/5 py-5 px-8 sm:px-16 lg:px-24">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 text-xs text-text-muted">
          <div>
            © 2026 Built by Akshay Jain · An Independent project.
          </div>

          <div className="flex items-center gap-3">
                  
                  {/* GitHub */}
                  <a 
                    href="https://github.com/idealidler" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-2 bg-text/5 rounded-lg text-text-muted hover:text-text hover:bg-text/10 transition-all group"
                    title="View my GitHub"
                  >
                    <svg
                      className="w-4 h-4 group-hover:scale-110 transition-transform"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </a>
          
                  {/* LinkedIn */}
                  <a 
                    href="https://www.linkedin.com/in/akshayjain128/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-2 bg-text/5 rounded-lg text-text-muted hover:text-[#0A66C2] hover:bg-[#0A66C2]/10 transition-all group"
                    title="Connect on LinkedIn"
                  >
                    <svg
                      className="w-4 h-4 group-hover:scale-110 transition-transform"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </a>
          
                  {/* Email */}
                  <a 
                    href="mailto:akshayjain128@gmail.com" 
                    className="p-2 bg-text/5 rounded-lg text-text-muted hover:text-primary hover:bg-primary/10 transition-all group"
                    title="Send me an email"
                  >
                    <EnvelopeIcon className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  </a>
                </div>
        </div>
      </footer>

    </div>
  );
};

export default Login;