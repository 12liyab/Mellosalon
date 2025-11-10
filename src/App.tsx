import { useState, useEffect } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from './firebase';
import Welcome from './components/Welcome';
import ClientDashboard from './components/ClientDashboard';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';

function App() {
  const [showWelcome, setShowWelcome] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const path = window.location.pathname;
    if (path === '/admin') {
      setIsAdmin(true);
      setShowWelcome(false);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleWelcomeComplete = () => {
    setShowWelcome(false);
  };

  const handleAdminLogin = () => {
    // Firebase auth state will be updated automatically
  };

  const handleAdminLogout = () => {
    auth.signOut();
    window.location.href = '/';
  };

  if (showWelcome) {
    return <Welcome onComplete={handleWelcomeComplete} />;
  }

  if (isAdmin) {
    if (currentUser) {
      return <AdminDashboard onLogout={handleAdminLogout} />;
    }
    return <AdminLogin onLogin={handleAdminLogin} />;
  }

  return <ClientDashboard />;
}

export default App;
