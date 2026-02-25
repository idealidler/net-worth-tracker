// src/App.jsx
import { useState, useEffect } from 'react';
import { useAuth } from './context/AuthContext';
import { db } from './firebase';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { Analytics } from "@vercel/analytics/react"
import { motion, AnimatePresence } from 'framer-motion';

import Dashboard from './components/Dashboard';
import LoginPage from './components/LoginPage';
import WelcomePage from './components/WelcomePage';
import { templateData } from './data/templateData';

const LoadingScreen = () => (
  <motion.div 
    key="loading"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="bg-background min-h-screen flex flex-col items-center justify-center space-y-6"
  >
    <div className="w-14 h-14 border-4 border-text/10 border-t-primary rounded-full animate-spin"></div>
    <p className="text-text-muted font-medium tracking-wide animate-pulse">Loading your financial hub...</p>
  </motion.div>
);

function App() {
  const { currentUser } = useAuth();
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const isDemo = new URLSearchParams(window.location.search).get('demo');
    if (isDemo === 'true') {
      setLoading(false);
      return;
    }

    if (!currentUser) {
      setUserProfile(null);
      setLoading(false);
      return;
    }

    const fetchProfile = async () => {
      setLoading(true);
      const userDocRef = doc(db, "users", currentUser.uid);
      const userDocSnap = await getDoc(userDocRef);
      
      if (userDocSnap.exists()) {
        setUserProfile(userDocSnap.data());
      } else {
        // THE FIX: Safely catch brand new users so the app doesn't freeze
        setUserProfile({ onboardingComplete: false });
      }
      setLoading(false);
    };

    fetchProfile();
  }, [currentUser]);

  const handleOnboardingComplete = async (name) => {
    if (!currentUser) return;

    const userDocRef = doc(db, "users", currentUser.uid);
    await updateDoc(userDocRef, {
      displayName: name,
      onboardingComplete: true
    });

    const today = new Date().toISOString().split('T')[0];
    const initialSnapshot = { ...templateData[0], date: today };

    const snapshotDocRef = doc(db, "users", currentUser.uid, "snapshots", today);
    await setDoc(snapshotDocRef, initialSnapshot);

    setUserProfile(prev => ({ ...prev, displayName: name, onboardingComplete: true }));
  };

  const renderContent = () => {
    const isDemo = new URLSearchParams(window.location.search).get('demo');
    if (isDemo === 'true') {
      return (
        <motion.div key="dashboard-demo" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <Dashboard userName="Recruiter" />
        </motion.div>
      );
    }

    if (loading) return <LoadingScreen key="loading" />;

    if (!currentUser) {
      return (
        <motion.div key="login" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <LoginPage />
        </motion.div>
      );
    }
    
    if (userProfile && !userProfile.onboardingComplete) {
      return (
        <motion.div key="welcome" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
          <WelcomePage onComplete={handleOnboardingComplete} />
        </motion.div>
      );
    }

    if (userProfile && userProfile.onboardingComplete) {
      return (
        <motion.div key="dashboard" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
          <Dashboard userName={userProfile?.displayName || 'User'} />
        </motion.div>
      );
    }

    return <LoadingScreen key="fallback-loading" />;
  };

  return (
    <div className="bg-background min-h-screen text-text selection:bg-primary/30">
      <AnimatePresence mode="wait">
        {renderContent()}
      </AnimatePresence>
    </div>
  );
}

export default App;