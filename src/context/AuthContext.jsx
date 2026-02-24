// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { auth } from '../firebase';
import { GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      return await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Error signing in with Google:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      return await signOut(auth);
    } catch (error) {
      console.error("Error signing out:", error);
      throw error;
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      setCurrentUser(user);
      setLoading(false);
    });
    
    // Cleanup subscription on unmount
    return unsubscribe;
  }, []);

  // useMemo prevents unnecessary re-renders of child components
  const value = useMemo(() => ({
    currentUser,
    signInWithGoogle,
    logout
  }), [currentUser]);

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};