// src/components/PrivacyModal.jsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon, ShieldCheckIcon, ServerStackIcon, KeyIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

const PrivacyModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center px-4 sm:px-6">
        {/* Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }} 
          onClick={onClose}
          className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 10 }} 
          animate={{ opacity: 1, scale: 1, y: 0 }} 
          exit={{ opacity: 0, scale: 0.95, y: 10 }} 
          className="relative w-full max-w-2xl bg-surface border border-text/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
        >
          {/* Header */}
          <div className="flex justify-between items-center p-6 border-b border-text/5 bg-background/50">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-accent-green/10 rounded-xl">
                <ShieldCheckIcon className="w-6 h-6 text-accent-green" />
              </div>
              <div>
                <h2 className="text-xl font-extrabold text-text">Security & Privacy Architecture</h2>
                <p className="text-sm font-medium text-text-muted mt-0.5">Absolute transparency on how your data is handled.</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 bg-text/5 text-text-muted hover:bg-text/10 hover:text-text rounded-xl transition-colors">
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>

          {/* Scrollable Content */}
          <div className="p-6 overflow-y-auto custom-scrollbar space-y-8">
            
            <p className="text-text leading-relaxed">
              Financial data requires the highest level of trust. This application was architected to ensure your numbers remain secure, encrypted, and strictly under your control. Here is exactly how your data flows through our system:
            </p>

            <div className="space-y-6">
              {/* Point 1: Authentication */}
              <div className="flex gap-4">
                <div className="mt-1"><KeyIcon className="w-6 h-6 text-primary" /></div>
                <div>
                  <h3 className="text-lg font-bold text-text">1. How You Log In (Authentication)</h3>
                  <p className="text-text-muted mt-1 leading-relaxed">
                    This platform uses <strong>Google OAuth</strong> via Firebase Authentication. We never see, process, or store your passwords. Your identity is verified directly by Google, issuing a secure, temporary token to access your dashboard.
                  </p>
                </div>
              </div>

              {/* Point 2: Storage */}
              <div className="flex gap-4">
                <div className="mt-1"><ServerStackIcon className="w-6 h-6 text-primary" /></div>
                <div>
                  <h3 className="text-lg font-bold text-text">2. Where Your Data Lives (Infrastructure)</h3>
                  <p className="text-text-muted mt-1 leading-relaxed">
                    Your financial snapshots and goals are stored on <strong>Google Cloud's Firebase Firestore</strong>. Your data is encrypted at rest (using AES-256) and encrypted in transit (via HTTPS/TLS). It does not live on a vulnerable private server.
                  </p>
                </div>
              </div>

              {/* Point 3: Access */}
              <div className="flex gap-4">
                <div className="mt-1"><EyeSlashIcon className="w-6 h-6 text-primary" /></div>
                <div>
                  <h3 className="text-lg font-bold text-text">3. Who Has Access (Data Isolation)</h3>
                  <p className="text-text-muted mt-1 leading-relaxed">
                    The database enforces strict, user-scoped security rules. Your data is cryptographically locked to your specific Google Account ID. 
                    <br/><br/>
                    <strong>Do I have access to it?</strong> As the application architect, I maintain the cloud infrastructure. However, I do not monitor, mine, monetize, or analyze your personal financial entries. There are no advertising trackers, and your data is never sold to third parties.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-5 bg-text/5 rounded-2xl border border-text/10">
              <h4 className="font-bold text-text mb-2">The Bottom Line</h4>
              <p className="text-sm text-text-muted leading-relaxed">
                This tool was built to push the boundaries of modern fintech UX, not to harvest data. You own your numbers. If you delete a goal or a snapshot, it is permanently erased from the database.
              </p>
              <p className="text-sm text-text-muted mt-4">
                Questions about the architecture? Reach out at <a href="mailto:akshayjain128@gmail.com" className="text-primary font-semibold hover:underline">akshayjain128@gmail.com</a>.
              </p>
            </div>

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default PrivacyModal;