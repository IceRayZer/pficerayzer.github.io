import { useState, useEffect, useMemo } from 'react';
import { Routes, Route, useLocation, useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase, isSupabaseConfigured } from './lib/supabase';
import { Portfolio } from './pages/Portfolio';
import { AdminLogin } from './pages/AdminLogin';
import { AdminDashboard } from './pages/AdminDashboard';
import { AuthGuard } from './components/AuthGuard';
import { ProjectModal } from './components/ProjectModal';
import { Project, Language } from './types';
import { useProjects } from './hooks/useProjects';

function App() {
  const location = useLocation();
  const navigate = useNavigate();

  // État d'authentification global
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Background location pour les modals
  const background = location.state?.backgroundLocation;

  useEffect(() => {
    if (isSupabaseConfigured) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        setIsAuthenticated(!!session);
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
        setIsAuthenticated(!!session);
        if (event === 'SIGNED_OUT') {
          navigate('/');
        }
      });

      return () => subscription.unsubscribe();
    }
  }, [navigate]);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    navigate('/admin');
  };

  const handleLogout = async () => {
    if (isSupabaseConfigured) {
      await supabase.auth.signOut();
    }
    setIsAuthenticated(false);
    navigate('/');
  };

  return (
    <>
      {/* Routes principales */}
      <Routes location={background || location}>
        <Route
          path="/"
          element={<Portfolio isAdmin={isAuthenticated} />}
        />

        <Route
          path="/project/:id"
          element={<PortfolioWithModal />}
        />

        <Route
          path="/login"
          element={<AdminLogin onLoginSuccess={handleLoginSuccess} />}
        />

        <Route
          path="/admin"
          element={
            <AuthGuard>
              <AdminDashboard
                onLogout={handleLogout}
                onBackToPortfolio={() => navigate('/')}
              />
            </AuthGuard>
          }
        />
      </Routes>

      {/* Modal par-dessus si navigation depuis l'accueil */}
      <AnimatePresence>
        {background && (
          <Routes>
            <Route path="/project/:id" element={<ModalRoute />} />
          </Routes>
        )}
      </AnimatePresence>
    </>
  );
}

// Composant helper pour afficher Portfolio + Modal quand on arrive directement sur /project/:id
function PortfolioWithModal() {
  const { id } = useParams<{ id: string }>();
  const { projects } = useProjects();
  const [language, setLanguage] = useState<Language>('en');
  const navigate = useNavigate();

  const selectedProject = useMemo(() => {
    return projects.find((p) => p.id === id) || null;
  }, [projects, id]);

  return (
    <>
      <Portfolio isAdmin={false} />
      {selectedProject && (
        <ProjectModal
          project={selectedProject}
          onClose={() => navigate('/')}
          language={language}
        />
      )}
    </>
  );
}

// Composant pour afficher la modal quand on navigue depuis l'accueil
function ModalRoute() {
  const { id } = useParams<{ id: string }>();
  const { projects } = useProjects();
  const [language, setLanguage] = useState<Language>('en');
  const navigate = useNavigate();

  const selectedProject = useMemo(() => {
    return projects.find((p) => p.id === id) || null;
  }, [projects, id]);

  if (!selectedProject) {
    navigate('/');
    return null;
  }

  return (
    <ProjectModal
      project={selectedProject}
      onClose={() => navigate(-1)}
      language={language}
    />
  );
}

export default App;
