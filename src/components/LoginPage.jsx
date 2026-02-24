// src/components/LoginPage.jsx
import React from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { motion } from 'framer-motion';
import { ChartBarSquareIcon } from '@heroicons/react/24/solid';

const LoginPage = () => {
  const { signInWithGoogle } = useAuth();

  const handleSignIn = async () => {
    try {
      const result = await signInWithGoogle();
      const user = result.user; // Extract user from the Google Auth result
      
      const userDocRef = doc(db, "users", user.uid);
      const userDocSnap = await getDoc(userDocRef);

      // If the user is brand new, create a shell profile for them.
      // The WelcomePage will fill in the details.
      if (!userDocSnap.exists()) {
        await setDoc(userDocRef, {
          email: user.email,
          createdAt: new Date(),
          onboardingComplete: false // Set the flag to false to trigger WelcomePage
        });
      }
    } catch (error) {
      console.error("Failed to sign in", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background relative overflow-hidden">
      {/* Subtle background glowing orb */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/20 blur-[120px] rounded-full pointer-events-none"></div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="z-10 p-10 bg-surface/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-text/10 text-center max-w-md w-full mx-4"
      >
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-primary/10 rounded-2xl text-primary">
            <ChartBarSquareIcon className="w-12 h-12" />
          </div>
        </div>
        
        <h1 className="text-3xl font-extrabold text-text mb-2 tracking-tight">Net Worth Tracker</h1>
        <p className="text-text-muted mb-10 text-lg">Sign in to master your finances.</p>
        
        <div className="space-y-4">
          <button
            onClick={handleSignIn}
            className="w-full justify-center px-6 py-4 bg-background border border-text/10 text-text font-bold rounded-xl hover:bg-text/5 hover:border-text/20 hover:shadow-md transition-all flex items-center gap-3 transform hover:-translate-y-0.5"
          >
            <svg className="w-6 h-6" viewBox="0 0 48 48">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
              <path fill="none" d="M0 0h48v48H0z"></path>
            </svg>
            Continue with Google
          </button>

          <div className="relative flex items-center py-2">
            <div className="flex-grow border-t border-text/10"></div>
            <span className="flex-shrink-0 mx-4 text-text-muted text-sm font-medium">or</span>
            <div className="flex-grow border-t border-text/10"></div>
          </div>

          <button
            onClick={() => window.location.href = '/?demo=true'}
            className="w-full justify-center px-6 py-4 bg-primary text-background font-bold rounded-xl hover:bg-primary-dark hover:shadow-lg transition-all transform hover:-translate-y-0.5"
          >
            Try Live Demo
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;