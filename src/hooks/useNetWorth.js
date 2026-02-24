// src/hooks/useNetWorth.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { collection, doc, getDocs, orderBy, query, setDoc, deleteDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';
import { mockData } from '../data/mockData';

// Check if we are in demo mode
const isDemo = new URLSearchParams(window.location.search).get('demo') === 'true';

// 1. Hook to FETCH data
export const useSnapshots = () => {
  const { currentUser } = useAuth();
  
  return useQuery({
    queryKey: ['snapshots', currentUser?.uid],
    queryFn: async () => {
      if (isDemo) return mockData; // Return fake data instantly
      if (!currentUser) return [];
      
      const q = query(collection(db, "users", currentUser.uid, "snapshots"), orderBy("date", "desc"));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => doc.data());
    },
    // Only run this query if we are in demo mode OR the user is logged in
    enabled: isDemo || !!currentUser, 
  });
};

// 2. Hook to UPDATE data
export const useUpdateSnapshot = () => {
  const { currentUser } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (updatedSnapshot) => {
      if (isDemo) {
        alert("Demo mode: Data cannot be saved to the database.");
        return;
      }
      const docRef = doc(db, "users", currentUser.uid, "snapshots", updatedSnapshot.date);
      await updateDoc(docRef, { categories: updatedSnapshot.categories });
    },
    // When successful, tell React Query to refresh the 'snapshots' cache!
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['snapshots', currentUser?.uid] });
    }
  });
};

// 3. Hook to ADD data
export const useAddSnapshot = () => {
  const { currentUser } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newSnapshot) => {
      if (isDemo) {
        alert("Demo mode: Cannot create new snapshots.");
        return;
      }
      const docRef = doc(db, "users", currentUser.uid, "snapshots", newSnapshot.date);
      await setDoc(docRef, newSnapshot);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['snapshots', currentUser?.uid] });
    }
  });
};

// 4. Hook to DELETE data
export const useDeleteSnapshot = () => {
  const { currentUser } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (dateToDelete) => {
      if (isDemo) {
        alert("Demo mode: Cannot delete snapshots.");
        return;
      }
      const docRef = doc(db, "users", currentUser.uid, "snapshots", dateToDelete);
      await deleteDoc(docRef);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['snapshots', currentUser?.uid] });
    }
  });
};