import { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from './lib/supabase';
import { Portfolio } from './pages/Portfolio';
import { AdminLogin } from './pages/AdminLogin';
import { AdminDashboard } from './pages/AdminDashboard';

type View = 'portfolio' | 'admin-login' | 'admin-dashboard';

function App() {
  const [currentView, setCurrentView] = useState<View>('portfolio');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    if (isSupabaseConfigured) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        setIsAuthenticated(!!session);
        if (session && currentView === 'admin-login') {
          setCurrentView('admin-dashboard');
        }
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
        (async () => {
          setIsAuthenticated(!!session);
          if (event === 'SIGNED_IN' && session) {
            setCurrentView('admin-dashboard');
          } else if (event === 'SIGNED_OUT') {
            setCurrentView('portfolio');
          }
        })();
      });

      return () => subscription.unsubscribe();
    }
  }, [currentView]);

  const handleAdminClick = () => {
    if (isAuthenticated) {
      setCurrentView('admin-dashboard');
    } else {
      setCurrentView('admin-login');
    }
  };

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    setCurrentView('admin-dashboard');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentView('portfolio');
  };

  const handleBackToPortfolio = () => {
    setCurrentView('portfolio');
  };

  if (currentView === 'admin-login') {
    return <AdminLogin onLoginSuccess={handleLoginSuccess} />;
  }

  if (currentView === 'admin-dashboard') {
    return (
      <AdminDashboard
        onLogout={handleLogout}
        onBackToPortfolio={handleBackToPortfolio}
      />
    );
  }

  return (
    <Portfolio
      onAdminClick={handleAdminClick}
      isAdmin={isAuthenticated}
    />
  );
}

export default App;
