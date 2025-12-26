import { motion, AnimatePresence } from 'framer-motion';
import { X, Volume2, VolumeX, Calendar, Tag } from 'lucide-react';
import { Project } from '../types';
import { useState } from 'react';

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
  language: 'en' | 'fr';
}

export function ProjectModal({ project, onClose, language }: ProjectModalProps) {
  const [isMuted, setIsMuted] = useState(true);

  if (!project) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/90 z-[200] flex items-center justify-center p-4 sm:p-6"
      >
        <motion.div
          layoutId={`project-card-${project.id}`}
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
          // Changement ici : max-w-6xl pour le format "Article" large
          className="relative w-full max-w-6xl max-h-[90vh] bg-zinc-950 rounded-xl overflow-hidden shadow-2xl flex flex-col"
        >
          {/* Bouton Fermer */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-50 p-2 bg-black/50 hover:bg-black/80 rounded-full text-white transition-colors backdrop-blur-md"
          >
            <X size={24} />
          </button>

          {/* Zone de contenu Scrollable */}
          <div className="overflow-y-auto custom-scrollbar flex-1">
            
            {/* 1. Header Hero (Vidéo ou Image) */}
            <div className="relative aspect-video w-full bg-black">
              {project.preview_video_url ? (
                <>
                  <video
                    src={project.preview_video_url}
                    autoPlay
                    loop
                    muted={isMuted}
                    playsInline
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={() => setIsMuted(!isMuted)}
                    className="absolute bottom-6 right-6 p-3 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors backdrop-blur-sm"
                  >
                    {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                  </button>
                </>
              ) : (
                <img
                  src={project.thumbnail_url}
                  alt={project.title}
                  className="w-full h-full object-cover"
                />
              )}
              {/* Dégradé vers le contenu */}
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent" />
            </div>

            {/* 2. Contenu de l'article */}
            <div className="px-8 md:px-16 py-10 -mt-20 relative">
              
              {/* Titre et Métadonnées */}
              <div className="mb-12 space-y-4">
                <motion.h2 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="text-4xl md:text-6xl font-black text-white drop-shadow-lg"
                >
                  {project.title}
                </motion.h2>

                <div className="flex flex-wrap items-center gap-4 text-zinc-400">
                  {/* Tags */}
                  <div className="flex flex-wrap gap-2">
                    {project.tags?.map((tag) => (
                      <span
                        key={tag.id}
                        className="px-3 py-1 rounded-full text-sm font-medium text-white shadow-sm"
                        style={{ backgroundColor: tag.hex_color }}
                      >
                        {tag.label}
                      </span>
                    ))}
                  </div>

                  {/* Date (si dispo) */}
                  {project.created_at && (
                    <div className="flex items-center gap-2 text-sm border-l border-zinc-700 pl-4">
                      <Calendar size={14} />
                      <span>{new Date(project.created_at).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Logiciels utilisés */}
              {project.software_icons && project.software_icons.length > 0 && (
                <div className="mb-8 p-4 bg-zinc-900/50 rounded-lg border border-zinc-800 inline-block">
                  <span className="text-zinc-500 text-xs font-bold uppercase tracking-wider block mb-2">
                    {language === 'fr' ? 'Stack Technique' : 'Tech Stack'}
                  </span>
                  <div className="flex gap-3">
                    {project.software_icons.map((software, idx) => (
                      <span key={idx} className="text-zinc-300 font-medium">
                        {software}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* 3. Corps de l'article (Affichage des Blocs) */}
              <div className="space-y-8 max-w-4xl">
                {/* C'est ICI qu'on restaure ta logique de blocs */}
                {Array.isArray(project.description) ? (
                  project.description.map((block: any) => {
                    if (block.type === 'text') {
                      return (
                        <div key={block.id} className="prose prose-invert prose-lg max-w-none text-zinc-300 leading-relaxed whitespace-pre-line">
                          {block.content}
                        </div>
                      );
                    }
                    if (block.type === 'image') {
                      return (
                        <div key={block.id} className="my-8">
                          <img
                            src={block.content}
                            alt="Project detail"
                            className="w-full rounded-xl shadow-lg border border-zinc-800"
                          />
                        </div>
                      );
                    }
                    if (block.type === 'video') {
                      return (
                        <div key={block.id} className="my-8 rounded-xl overflow-hidden shadow-lg border border-zinc-800">
                          <video
                            src={block.content}
                            controls
                            className="w-full"
                          />
                        </div>
                      );
                    }
                    return null;
                  })
                ) : (
                  // Fallback au cas où description serait une string simple (sécurité)
                  <p className="text-zinc-300 whitespace-pre-line text-lg">
                    {project.description}
                  </p>
                )}
              </div>

            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}