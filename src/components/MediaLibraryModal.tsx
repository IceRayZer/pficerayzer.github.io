import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Image as ImageIcon, Film, Music, Loader2, Copy, Check } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface MediaLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (url: string, type: 'image' | 'video' | 'audio') => void;
}

interface FileObject {
  name: string;
  id: string;
  metadata: {
    mimetype: string;
  };
}

export function MediaLibraryModal({ isOpen, onClose, onSelect }: MediaLibraryModalProps) {
  const [files, setFiles] = useState<FileObject[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<'all' | 'image' | 'video' | 'audio'>('all');
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      fetchFiles();
    }
  }, [isOpen]);

  const fetchFiles = async () => {
    setLoading(true);
    // On liste les fichiers du bucket 'portfolio'
    const { data, error } = await supabase.storage.from('portfolio').list('', {
      limit: 100,
      sortBy: { column: 'created_at', order: 'desc' },
    });

    if (data) {
      setFiles(data as any);
    }
    setLoading(false);
  };

  const getPublicUrl = (fileName: string) => {
    const { data } = supabase.storage.from('portfolio').getPublicUrl(fileName);
    return data.publicUrl;
  };

  const getFileType = (mimetype: string): 'image' | 'video' | 'audio' => {
    if (mimetype.includes('image')) return 'image';
    if (mimetype.includes('video')) return 'video';
    if (mimetype.includes('audio')) return 'audio';
    return 'image'; // Fallback
  };

  const filteredFiles = files.filter(file => {
    if (filter === 'all') return true;
    return file.metadata?.mimetype?.includes(filter);
  });

  const handleCopyUrl = (e: React.MouseEvent, url: string) => {
    e.stopPropagation();
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 z-[300] flex items-center justify-center p-6"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-zinc-900 w-full max-w-4xl h-[80vh] rounded-xl flex flex-col overflow-hidden border border-zinc-800"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-4 border-b border-zinc-800 flex justify-between items-center bg-zinc-900">
            <h2 className="text-xl font-bold text-white">Médiathèque</h2>
            <div className="flex gap-2">
               {/* Filtres */}
              {(['all', 'image', 'video', 'audio'] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-3 py-1 rounded text-sm capitalize ${
                    filter === f ? 'bg-white text-black' : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                  }`}
                >
                  {f}
                </button>
              ))}
              <button onClick={onClose} className="ml-4 p-2 bg-zinc-800 rounded-full hover:bg-zinc-700 text-white">
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Grille de fichiers */}
          <div className="flex-1 overflow-y-auto p-4 custom-scrollbar bg-zinc-950">
            {loading ? (
              <div className="flex justify-center items-center h-full">
                <Loader2 className="animate-spin text-white w-8 h-8" />
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {filteredFiles.map((file) => {
                  const url = getPublicUrl(file.name);
                  const type = getFileType(file.metadata?.mimetype || '');
                  
                  return (
                    <div 
                      key={file.id} 
                      onClick={() => onSelect(url, type)}
                      className="group relative aspect-square bg-zinc-900 rounded-lg border border-zinc-800 hover:border-white cursor-pointer overflow-hidden transition-all"
                    >
                      {/* Prévisualisation selon le type */}
                      {type === 'image' && (
                        <img src={url} alt={file.name} className="w-full h-full object-cover" />
                      )}
                      {type === 'video' && (
                        <div className="w-full h-full flex items-center justify-center bg-zinc-900 text-zinc-500">
                          <Film size={32} />
                        </div>
                      )}
                      {type === 'audio' && (
                        <div className="w-full h-full flex items-center justify-center bg-zinc-900 text-zinc-500">
                          <Music size={32} />
                        </div>
                      )}

                      {/* Overlay Info */}
                      <div className="absolute inset-x-0 bottom-0 bg-black/80 p-2 text-xs text-white truncate">
                        {file.name}
                      </div>

                      {/* Actions au survol */}
                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                         <button
                           onClick={(e) => handleCopyUrl(e, url)}
                           className="p-1.5 bg-black/50 hover:bg-black rounded text-white"
                           title="Copier l'URL"
                         >
                           {copiedUrl === url ? <Check size={14} className="text-green-500"/> : <Copy size={14}/>}
                         </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}