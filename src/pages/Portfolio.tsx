import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Navbar } from '../components/Navbar';
import { ProjectCard } from '../components/ProjectCard';
import { ProjectModal } from '../components/ProjectModal';
import { SoftwareFilter } from '../components/SoftwareFilter';
import { useProjects } from '../hooks/useProjects';
import { useWishlist } from '../hooks/useWishlist';
import { Project, Language } from '../types';

interface PortfolioProps {
  onAdminClick: () => void;
  isAdmin: boolean;
}

export function Portfolio({ onAdminClick, isAdmin }: PortfolioProps) {
  const { projects, loading } = useProjects();
  const { wishlistCount, toggleWishlist, isInWishlist } = useWishlist();
  const [language, setLanguage] = useState<Language>('en');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedSoftware, setSelectedSoftware] = useState<string | null>(null);
  const [showWishlistOnly, setShowWishlistOnly] = useState(false);

  const allSoftware = useMemo(() => {
    const softwareSet = new Set<string>();
    projects.forEach((project) => {
      project.software_icons?.forEach((sw) => softwareSet.add(sw));
    });
    return Array.from(softwareSet).sort();
  }, [projects]);

  const filteredProjects = useMemo(() => {
    let filtered = projects;

    if (selectedSoftware) {
      filtered = filtered.filter((project) =>
        project.software_icons?.includes(selectedSoftware)
      );
    }

    if (showWishlistOnly) {
      filtered = filtered.filter((project) => isInWishlist(project.id));
    }

    return filtered;
  }, [projects, selectedSoftware, showWishlistOnly, isInWishlist]);

  const handleShuffle = () => {
    if (filteredProjects.length > 0) {
      const randomProject =
        filteredProjects[Math.floor(Math.random() * filteredProjects.length)];
      setSelectedProject(randomProject);
    }
  };

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
  };

  const handleWishlistClick = () => {
    setShowWishlistOnly(!showWishlistOnly);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950">
      <Navbar
        wishlistCount={wishlistCount}
        language={language}
        onLanguageChange={handleLanguageChange}
        onShuffle={handleShuffle}
        onWishlistClick={handleWishlistClick}
        onAdminClick={onAdminClick}
        isAdmin={isAdmin}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <SoftwareFilter
          software={allSoftware}
          selectedSoftware={selectedSoftware}
          onSelectSoftware={setSelectedSoftware}
          language={language}
        />

        {showWishlistOnly && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between p-4 bg-zinc-900 rounded-lg border border-zinc-800"
          >
            <span className="text-white font-medium">
              {language === 'fr'
                ? `${filteredProjects.length} projet(s) dans votre liste`
                : `${filteredProjects.length} project(s) in your wishlist`}
            </span>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowWishlistOnly(false)}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors"
            >
              {language === 'fr' ? 'Voir tous' : 'Show all'}
            </motion.button>
          </motion.div>
        )}

        {filteredProjects.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg">
              {language === 'fr' ? 'Aucun projet trouvé' : 'No projects found'}
            </p>
          </div>
        ) : (
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                isInWishlist={isInWishlist(project.id)}
                onToggleWishlist={toggleWishlist}
                onPlay={setSelectedProject}
                language={language}
              />
            ))}
          </motion.div>
        )}
      </main>

      {selectedProject && (
        <ProjectModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
          language={language}
        />
      )}
    </div>
  );
}
