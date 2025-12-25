import { motion, AnimatePresence } from 'framer-motion';
import { X, Play, Volume2, VolumeX } from 'lucide-react';
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
        className="fixed inset-0 bg-black/90 z-[200] flex items-center justify-center p-4 overflow-y-auto"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-4xl bg-zinc-900 rounded-lg overflow-hidden my-8"
        >
          <motion.button
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 bg-zinc-800 hover:bg-zinc-700 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-white" />
          </motion.button>

          <div className="relative aspect-video bg-black">
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
                  className="absolute bottom-4 right-4 p-2 bg-zinc-800/80 hover:bg-zinc-700 rounded-full transition-colors"
                >
                  {isMuted ? (
                    <VolumeX className="w-5 h-5 text-white" />
                  ) : (
                    <Volume2 className="w-5 h-5 text-white" />
                  )}
                </button>
              </>
            ) : (
              <img
                src={project.thumbnail_url}
                alt={project.title}
                className="w-full h-full object-cover"
              />
            )}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-zinc-900 to-transparent" />
          </div>

          <div className="p-8 space-y-6">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold text-white">{project.title}</h2>
                <div className="flex flex-wrap gap-2">
                  {project.tags?.map((tag) => (
                    <span
                      key={tag.id}
                      className="px-3 py-1 rounded-full text-sm font-medium text-white"
                      style={{ backgroundColor: tag.hex_color }}
                    >
                      {tag.label}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {project.software_icons && project.software_icons.length > 0 && (
              <div className="flex gap-2">
                <span className="text-gray-400 text-sm font-medium">
                  {language === 'fr' ? 'Logiciels:' : 'Software:'}
                </span>
                <div className="flex gap-2">
                  {project.software_icons.map((software, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 bg-zinc-800 text-gray-300 rounded text-sm"
                    >
                      {software}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-4">
              {project.description.map((block) => {
                if (block.type === 'text') {
                  return (
                    <div key={block.id} className="text-gray-300 leading-relaxed">
                      {block.content}
                    </div>
                  );
                }
                if (block.type === 'image') {
                  return (
                    <img
                      key={block.id}
                      src={block.content}
                      alt="Project content"
                      className="w-full rounded-lg"
                    />
                  );
                }
                if (block.type === 'video') {
                  return (
                    <video
                      key={block.id}
                      src={block.content}
                      controls
                      className="w-full rounded-lg"
                    />
                  );
                }
                return null;
              })}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
