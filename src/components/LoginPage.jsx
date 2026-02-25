// src/components/Login.jsx
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { 
  ChartBarIcon, 
  BookOpenIcon, 
  ClockIcon, 
  ShieldCheckIcon,
  LockClosedIcon,
  ServerStackIcon,
  EnvelopeIcon
} from '@heroicons/react/24/outline';

const Login = () => {
  const { signInWithGoogle } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    try {
      setIsLoading(true);
      setError('');
      await signInWithGoogle();
    } catch (err) {
      console.error(err);

      if (
        err.code === 'auth/popup-closed-by-user' ||
        err.code === 'auth/cancelled-popup-request'
      ) {
        setIsLoading(false);
        return;
      }

      setError('Authentication failed. Please try again.');
      setIsLoading(false);
    }
  };

  const features = [
    {
      icon: BookOpenIcon,
      title: 'Dynamic Ledger',
      description:
        'Track assets and liabilities with structured, flexible account management.'
    },
    {
      icon: ClockIcon,
      title: 'Historical Snapshots',
      description:
        'Capture point-in-time balances to build a clean financial history.'
    },
    {
      icon: ChartBarIcon,
      title: 'Trend Analytics',
      description:
        'Visualize allocation, performance, and long-term trajectory.'
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background text-text selection:bg-primary/30 font-sans">

      {/* MAIN SPLIT CONTAINER */}
      <div className="flex-1 flex flex-col lg:flex-row relative">
        
        {/* LEFT SIDE */}
        <div className="w-full lg:w-[55%] bg-surface flex flex-col justify-center px-8 sm:px-16 lg:px-24 py-16 lg:py-0 relative overflow-hidden">

          {/* Subtle grid + glow */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgb(var(--color-text-muted)/0.025)_1px,transparent_1px),linear-gradient(to_bottom,rgb(var(--color-text-muted)/0.025)_1px,transparent_1px)] bg-[size:36px_36px]" />
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent opacity-50 pointer-events-none" />

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative z-10 max-w-xl"
          >
            

            <h1 className="text-4xl sm:text-5xl font-extrabold text-text tracking-tight mb-6 leading-tight">
              Financial clarity,
              <br className="hidden sm:block" />
              over time.
            </h1>

            <p className="text-lg text-text-muted leading-relaxed mb-14 font-medium">
              A private net worth tracker designed to help you understand your
              assets, liabilities, and long-term growth with confidence.
            </p>

            <div className="space-y-8">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 + index * 0.08 }}
                  className="flex gap-5 items-start"
                >
                  <div className="shrink-0 mt-0.5">
                    <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center border border-primary/10">
                      <feature.icon className="w-5 h-5 text-primary/80" />
                    </div>
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

        {/* Divider */}
        <div className="hidden lg:block w-px bg-gradient-to-b from-transparent via-text/10 to-transparent absolute left-[55%] top-12 bottom-12 z-20" />

        {/* RIGHT SIDE */}
        <div className="w-full lg:w-[45%] flex flex-col items-center justify-center px-8 sm:px-16 py-16 relative bg-background">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="w-full max-w-[420px]"
          >
            <div className="bg-surface border border-text/5 p-8 sm:p-10 rounded-3xl shadow-[0_10px_40px_rgb(0,0,0,0.05)] dark:shadow-[0_10px_40px_rgb(0,0,0,0.15)]">

              <div className="mb-8 text-center sm:text-left">
                <h2 className="text-2xl font-semibold text-text mb-2">
                  Access your dashboard
                </h2>
                <p className="text-sm text-text-muted">
                  Secure sign-in powered by Google.
                </p>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-accent-red/10 border border-accent-red/20 rounded-xl text-accent-red text-sm font-medium flex items-start gap-3">
                  <span className="shrink-0 mt-0.5">⚠️</span>
                  {error}
                </div>
              )}

              <button
                onClick={handleLogin}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-3 bg-background border border-text/10 px-6 py-3.5 rounded-xl font-semibold text-sm text-text hover:bg-text/[0.03] hover:border-text/20 transition-all focus:outline-none focus:ring-4 focus:ring-primary/10 disabled:opacity-70 disabled:cursor-not-allowed shadow-sm group"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-text/30 border-t-primary rounded-full animate-spin" />
                ) : (
                  <>
                    <svg
                      className="w-5 h-5 group-hover:scale-105 transition-transform"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        fill="#4285F4"
                      />
                      <path
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        fill="#34A853"
                      />
                      <path
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        fill="#FBBC05"
                      />
                      <path
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        fill="#EA4335"
                      />
                    </svg>
                    Continue with Google
                  </>
                )}
              </button>
            </div>

            <div className="mt-10 space-y-5 px-4 text-xs text-text-muted">
              <div className="flex gap-3">
                <LockClosedIcon className="w-4 h-4 shrink-0 mt-0.5" />
                <p>
                  Authentication is handled entirely by Google. This application
                  does not access your Google data beyond authentication.
                </p>
              </div>

              <div className="flex gap-3">
                <ShieldCheckIcon className="w-4 h-4 shrink-0 mt-0.5" />
                <p>
                  Your financial data is private. It is not monitored, sold, or
                  shared with third parties.
                </p>
              </div>

              <div className="flex gap-3">
                <ServerStackIcon className="w-4 h-4 shrink-0 mt-0.5" />
                <p>
                  All ledger entries and snapshots are transmitted securely and
                  encrypted at rest.
                </p>
              </div>
            </div>

          </motion.div>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="bg-surface border-t border-text/5 py-4 px-8 sm:px-16 lg:px-24 z-10 relative">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 text-xs text-text-muted">
          <div>
            © 2026 Built by Akshay Jain. An Independent portfolio project.
          </div>

          <div className="flex items-center gap-4">
            <a href="https://github.com/idealidler" target="_blank" rel="noopener noreferrer" className="p-2 bg-text/5 rounded-full text-text-muted hover:text-text hover:bg-text/10 transition-all"><svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" /></svg></a>
            <a href="https://www.linkedin.com/in/akshayjain128/" target="_blank" rel="noopener noreferrer" className="p-2 bg-text/5 rounded-full text-text-muted hover:text-[#0A66C2] hover:bg-[#0A66C2]/10 transition-all"><svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" /></svg></a>
            <a href="mailto:akshayjain128@gmail.com" className="p-2 bg-text/5 rounded-full text-text-muted hover:text-primary hover:bg-primary/10 transition-all"><EnvelopeIcon className="w-4 h-4" /></a>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default Login;