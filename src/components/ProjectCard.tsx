import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Play, Plus, Check } from 'lucide-react';
import { Project } from '../types';

interface ProjectCardProps {
  project: Project;
  isInWishlist: boolean;
  onToggleWishlist: (projectId: string) => void;
  onPlay: (project: Project) => void;
  language: 'en' | 'fr';
}

export function ProjectCard({
  project,
  isInWishlist,
  onToggleWishlist,
  onPlay,
  language
}: ProjectCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className="relative group cursor-pointer" // cursor-pointer sur toute la carte
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      layoutId={`project-card-${project.id}`}
      // C'est ICI que la magie opère : toute la carte déclenche l'ouverture
      onClick={() => onPlay(project)}
      style={{ zIndex: isHovered ? 50 : 1 }}
    >
      <motion.div
        className="relative bg-zinc-900 rounded-md overflow-hidden"
        animate={{
          scale: isHovered ? 1.05 : 1, // Légèrement moins zoomé pour rester élégant
          boxShadow: isHovered ? "0 20px 25px -5px rgb(0 0 0 / 0.5)" : "0 0 0 0 rgb(0 0 0 / 0)"
        }}
        transition={{ 
          duration: 0.3, 
          ease: [0.25, 0.46, 0.45, 0.94]
        }}
      >
        {/* Section vidéo/image - inchangée pour garder ton effet de preview */}
        <div className="aspect-video relative bg-zinc-800 overflow-hidden">
          <AnimatePresence mode="wait">
            {!isHovered ? (
              <motion.img
                key="thumbnail"
                src={project.thumbnail_url}
                alt={project.title}
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="w-full h-full object-cover"
              />
            ) : (
              <motion.div
                key="preview"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="absolute inset-0"
              >
                {project.preview_video_url ? (
                  <video
                    src={project.preview_video_url}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <img
                    src={project.thumbnail_url}
                    alt={project.title}
                    className="w-full h-full object-cover"
                  />
                )}
                {/* Overlay sombre pour la lisibilité du texte */}
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Section détails - apparaît au hover */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden bg-zinc-900"
            >
              <div className="p-4 space-y-3">
                <h3 className="text-white font-bold text-lg">{project.title}</h3>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {project.tags?.map((tag) => (
                    <span
                      key={tag.id}
                      className="px-2 py-1 rounded-full text-xs font-medium text-white"
                      style={{ backgroundColor: tag.hex_color }}
                    >
                      {tag.label}
                    </span>
                  ))}
                </div>

                {/* Boutons d'action */}
                <div className="flex items-center gap-2 pt-2">
                  {/* Faux bouton Play (visuel seulement) */}
                  <div className="flex items-center gap-2 px-4 py-2 bg-white text-black rounded-md font-semibold text-sm">
                    <Play className="w-4 h-4 fill-current" />
                    <span>{language === 'fr' ? 'Ouvrir' : 'Open'}</span>
                  </div>

                  {/* Bouton Wishlist - DOIT avoir stopPropagation */}
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => {
                      e.stopPropagation(); // Empêche d'ouvrir le modal quand on ajoute aux favoris
                      onToggleWishlist(project.id);
                    }}
                    className="p-2 rounded-full border-2 border-zinc-600 hover:border-white transition-colors ml-auto"
                  >
                    {isInWishlist ? (
                      <Check className="w-4 h-4 text-white" />
                    ) : (
                      <Plus className="w-4 h-4 text-white" />
                    )}
                  </motion.button>
                </div>

                {/* Icônes logiciels */}
                {project.software_icons && project.software_icons.length > 0 && (
                  <div className="flex gap-2 text-xs text-gray-400 pt-1">
                    {project.software_icons.map((software, idx) => (
                      <span key={idx} className="bg-zinc-800 px-1.5 py-0.5 rounded">
                        {software}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}