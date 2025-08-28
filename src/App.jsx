import { useState, useEffect } from 'react';
import { useAuth } from './context/AuthContext';
import { db } from './firebase';
import { collection, doc, getDocs, orderBy, query, setDoc, deleteDoc } from 'firebase/firestore';

import Dashboard from './components/Dashboard';
import LoginPage from './components/LoginPage';
import { netWorthData as initialData } from './data/mockData';

function App() {
  const { currentUser } = useAuth();
  const [netWorthData, setNetWorthData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) {
      setNetWorthData([]);
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      const snapshotsCollection = collection(db, "users", currentUser.uid, "snapshots");
      const q = query(snapshotsCollection, orderBy("date", "desc"));
      
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => doc.data());

      if (data.length === 0) {
        // For a new user, create their first snapshot from the mock data, dated today.
        const firstSnapshot = { ...initialData[0], date: new Date().toISOString().split('T')[0] };
        await setDoc(doc(db, "users", currentUser.uid, "snapshots", firstSnapshot.date), firstSnapshot);
        setNetWorthData([firstSnapshot]);
      } else {
        setNetWorthData(data);
      }
      setLoading(false);
    };

    fetchData();
  }, [currentUser]);

  const handleUpdateData = async (newEntryData) => {
    if (!currentUser) return;
    const docRef = doc(db, "users", currentUser.uid, "snapshots", newEntryData.date);
    await setDoc(docRef, newEntryData);
    
    // Update local state to reflect the change immediately
    const updatedData = netWorthData.map(d => d.date === newEntryData.date ? newEntryData : d);
    setNetWorthData(updatedData);
  };

  const handleAddNewSnapshot = async (newDate) => {
    if (!currentUser) return;

    // Use the latest data from state, which is already sorted
    const latestEntry = netWorthData[0];
    const copiedCategories = JSON.parse(JSON.stringify(latestEntry.categories));
    const newSnapshot = { date: newDate, categories: copiedCategories };

    const docRef = doc(db, "users", currentUser.uid, "snapshots", newDate);
    await setDoc(docRef, newSnapshot);

    const updatedData = [...netWorthData, newSnapshot].sort((a, b) => new Date(b.date) - new Date(a.date));
    setNetWorthData(updatedData);
  };

  const handleDeleteSnapshot = async (dateToDelete) => {
    if (!currentUser) return;
    
    const docRef = doc(db, "users", currentUser.uid, "snapshots", dateToDelete);
    await deleteDoc(docRef);

    const updatedData = netWorthData.filter(d => d.date !== dateToDelete);
    setNetWorthData(updatedData);
  };

  if (loading) {
    return (
      <div className="bg-background min-h-screen flex items-center justify-center text-text">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <main className="bg-background text-text min-h-screen">
      {currentUser ? (
        <Dashboard 
          data={netWorthData}
          onUpdate={handleUpdateData}
          onAddNewSnapshot={handleAddNewSnapshot}
          onDeleteSnapshot={handleDeleteSnapshot}
        />
      ) : (
        <LoginPage />
      )}
    </main>
  );
}

export default App;