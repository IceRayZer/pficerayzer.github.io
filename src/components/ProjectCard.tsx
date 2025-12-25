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
      className="relative group cursor-pointer"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <motion.div
        layout
        className="relative bg-zinc-900 rounded-md overflow-hidden"
        animate={{
          scale: isHovered ? 1.05 : 1,
          zIndex: isHovered ? 50 : 1,
        }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
      >
        <AnimatePresence>
          {!isHovered ? (
            <motion.div
              key="thumbnail"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="aspect-video"
            >
              <img
                src={project.thumbnail_url}
                alt={project.title}
                className="w-full h-full object-cover"
              />
            </motion.div>
          ) : (
            <motion.div
              key="expanded"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col"
            >
              <div className="aspect-video relative bg-zinc-800">
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
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent" />
              </div>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="p-4 space-y-3"
              >
                <h3 className="text-white font-bold text-lg">{project.title}</h3>

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

                <div className="flex items-center gap-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      onPlay(project);
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-white text-black rounded-md font-semibold hover:bg-gray-200 transition-colors"
                  >
                    <Play className="w-4 h-4 fill-current" />
                    <span>{language === 'fr' ? 'Voir plus' : 'Play'}</span>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleWishlist(project.id);
                    }}
                    className="p-2 rounded-full border-2 border-gray-400 hover:border-white transition-colors"
                  >
                    {isInWishlist ? (
                      <Check className="w-5 h-5 text-white" />
                    ) : (
                      <Plus className="w-5 h-5 text-white" />
                    )}
                  </motion.button>
                </div>

                {project.software_icons && project.software_icons.length > 0 && (
                  <div className="flex gap-2 text-xs text-gray-400">
                    {project.software_icons.map((software, idx) => (
                      <span key={idx} className="px-2 py-1 bg-zinc-800 rounded">
                        {software}
                      </span>
                    ))}
                  </div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
