import { useState, useEffect } from 'react';
import { useAuth } from './context/AuthContext';
import { db } from './firebase';
import { collection, doc, getDocs, orderBy, query, setDoc, deleteDoc, getDoc, updateDoc } from 'firebase/firestore';

import Dashboard from './components/Dashboard';
import LoginPage from './components/LoginPage';
import WelcomePage from './components/WelcomePage';
import { templateData } from './data/templateData';

function App() {
  const { currentUser } = useAuth();
  const [userProfile, setUserProfile] = useState(null);
  const [netWorthData, setNetWorthData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) {
      setNetWorthData([]);
      setUserProfile(null);
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      
      const userDocRef = doc(db, "users", currentUser.uid);
      const userDocSnap = await getDoc(userDocRef);
      if (userDocSnap.exists()) {
        const profile = userDocSnap.data();
        setUserProfile(profile);
        
        if (profile.onboardingComplete) {
          const snapshotsCollection = collection(db, "users", currentUser.uid, "snapshots");
          const q = query(snapshotsCollection, orderBy("date", "desc"));
          const querySnapshot = await getDocs(q);
          const data = querySnapshot.docs.map(doc => doc.data());
          setNetWorthData(data);
        }
      }
      setLoading(false);
    };

    fetchData();
  }, [currentUser]);

  const handleOnboardingComplete = async (name) => {
    if (!currentUser) return;
    const userDocRef = doc(db, "users", currentUser.uid);
    
    await updateDoc(userDocRef, {
      displayName: name,
      onboardingComplete: true
    });
    
    const firstSnapshot = { ...templateData[0], date: new Date().toISOString().split('T')[0] };
    await setDoc(doc(db, "users", currentUser.uid, "snapshots", firstSnapshot.date), firstSnapshot);
    
    setUserProfile(prev => ({ ...prev, displayName: name, onboardingComplete: true }));
    setNetWorthData([firstSnapshot]);
  };

  const handleUpdateData = async (newEntryData) => {
    if (!currentUser) return;
    const docRef = doc(db, "users", currentUser.uid, "snapshots", newEntryData.date);
    await setDoc(docRef, newEntryData);
    
    const updatedData = netWorthData.map(d => d.date === newEntryData.date ? newEntryData : d);
    setNetWorthData(updatedData);
  };

  const handleAddNewSnapshot = async (newDate) => {
    if (!currentUser) return;

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

  const renderContent = () => {
    if (loading) {
      return <div className="bg-background min-h-screen flex items-center justify-center text-text">Loading...</div>;
    }

    if (!currentUser) {
      return <LoginPage />;
    }
    
    if (userProfile && !userProfile.onboardingComplete) {
      return <WelcomePage onComplete={handleOnboardingComplete} />;
    }

    if (userProfile && userProfile.onboardingComplete) {
      return (
        <Dashboard 
          data={netWorthData}
          onUpdate={handleUpdateData}
          onAddNewSnapshot={handleAddNewSnapshot}
          onDeleteSnapshot={handleDeleteSnapshot}
          userName={userProfile?.displayName || 'User'}
        />
      );
    }

    return <div className="bg-background min-h-screen flex items-center justify-center text-text">Loading...</div>;
  };

  return <main className="bg-background text-text min-h-screen">{renderContent()}</main>;
}

export default App;