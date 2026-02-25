// src/hooks/useNetWorth.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { collection, doc, getDocs, orderBy, query, setDoc, deleteDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';
import { mockData } from '../data/mockData';

const isDemo = new URLSearchParams(window.location.search).get('demo') === 'true';

const mockGoals = [
  { id: 'goal_1', name: 'FIRE Number (Financial Independence)', targetAmount: 1000000, currentAmount: 0, isNetWorthLinked: true, color: 'bg-primary', icon: 'TrophyIcon' },
  { id: 'goal_2', name: 'House Down Payment', targetAmount: 80000, currentAmount: 35000, isNetWorthLinked: false, color: 'bg-purple-500', icon: 'HomeIcon' },
  { id: 'goal_3', name: 'Kids College Fund', targetAmount: 50000, currentAmount: 12000, isNetWorthLinked: false, color: 'bg-accent-green', icon: 'AcademicCapIcon' }
];

// --- SNAPSHOT HOOKS ---
export const useSnapshots = () => {
  const { currentUser } = useAuth();
  return useQuery({
    queryKey: ['snapshots', currentUser?.uid],
    queryFn: async () => {
      if (isDemo) return mockData;
      if (!currentUser) return [];
      const q = query(collection(db, "users", currentUser.uid, "snapshots"), orderBy("date", "desc"));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => doc.data());
    },
    enabled: isDemo || !!currentUser, 
  });
};

export const useUpdateSnapshot = () => {
  const { currentUser } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (updatedSnapshot) => {
      if (isDemo) throw new Error("Cannot save in demo mode.");
      const docRef = doc(db, "users", currentUser.uid, "snapshots", updatedSnapshot.date);
      return await updateDoc(docRef, { categories: updatedSnapshot.categories });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['snapshots', currentUser?.uid] }),
    onError: (err) => console.error("Firebase Snapshot Update Error:", err)
  });
};

export const useAddSnapshot = () => {
  const { currentUser } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newSnapshot) => {
      if (isDemo) throw new Error("Cannot save in demo mode.");
      const docRef = doc(db, "users", currentUser.uid, "snapshots", newSnapshot.date);
      return await setDoc(docRef, newSnapshot);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['snapshots', currentUser?.uid] }),
    onError: (err) => console.error("Firebase Snapshot Add Error:", err)
  });
};

export const useDeleteSnapshot = () => {
  const { currentUser } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (dateToDelete) => {
      if (isDemo) throw new Error("Cannot delete in demo mode.");
      const docRef = doc(db, "users", currentUser.uid, "snapshots", dateToDelete);
      return await deleteDoc(docRef);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['snapshots', currentUser?.uid] }),
    onError: (err) => console.error("Firebase Snapshot Delete Error:", err)
  });
};

// --- GOAL HOOKS ---
export const useGoals = () => {
  const { currentUser } = useAuth();
  return useQuery({
    queryKey: ['goals', currentUser?.uid],
    queryFn: async () => {
      if (isDemo) return mockGoals;
      if (!currentUser) return [];
      const q = query(collection(db, "users", currentUser.uid, "goals"));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => doc.data());
    },
    enabled: isDemo || !!currentUser, 
  });
};

export const useAddGoal = () => {
  const { currentUser } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newGoal) => {
      if (isDemo) throw new Error("Cannot save data in Demo Mode.");
      const docRef = doc(db, "users", currentUser.uid, "goals", newGoal.id);
      return await setDoc(docRef, newGoal);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['goals', currentUser?.uid] }),
    onError: (err) => console.error("Firebase Goal Add Error:", err)
  });
};

export const useUpdateGoal = () => {
  const { currentUser } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (updatedGoal) => {
      if (isDemo) throw new Error("Cannot save data in Demo Mode.");
      const docRef = doc(db, "users", currentUser.uid, "goals", updatedGoal.id);
      return await updateDoc(docRef, updatedGoal);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['goals', currentUser?.uid] }),
    onError: (err) => console.error("Firebase Goal Update Error:", err)
  });
};

export const useDeleteGoal = () => {
  const { currentUser } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (goalId) => {
      if (isDemo) throw new Error("Cannot delete data in Demo Mode.");
      const docRef = doc(db, "users", currentUser.uid, "goals", goalId);
      return await deleteDoc(docRef);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['goals', currentUser?.uid] }),
    onError: (err) => console.error("Firebase Goal Delete Error:", err)
  });
};