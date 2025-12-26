import { useState, useEffect } from 'react';
import { motion, Reorder } from 'framer-motion';
import { Save, X, Plus, Trash2, GripVertical, Image as ImageIcon, Type, Video, Music, FolderOpen, ArrowLeft } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { mockTags } from '../lib/mockData';
import { Project, Tag, ContentBlock } from '../types';
import { MediaLibraryModal } from './MediaLibraryModal';

interface ProjectEditorProps {
  project?: Project;
  onSave: () => void;
  onCancel: () => void;
}

const SOFTWARE_OPTIONS = ['Unity', 'Figma', 'Blender', 'Unreal Engine', 'Photoshop', 'Illustrator', 'After Effects', 'Premiere Pro'];

export function ProjectEditor({ project, onSave, onCancel }: ProjectEditorProps) {
  // --- États du Projet ---
  const [title, setTitle] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [previewVideoUrl, setPreviewVideoUrl] = useState('');
  const [softwareIcons, setSoftwareIcons] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [blocks, setBlocks] = useState<ContentBlock[]>([]);
  
  // --- États UI/Système ---
  const [availableTags, setAvailableTags] = useState<Tag[]>([]);
  const [saving, setSaving] = useState(false);
  const [isMediaLibraryOpen, setIsMediaLibraryOpen] = useState(false);
  const [activeBlockId, setActiveBlockId] = useState<string | null>(null); // Pour savoir quel bloc reçoit le média

  // --- Chargement des données ---
  useEffect(() => {
    fetchTags();

    if (project) {
      setTitle(project.title);
      setThumbnailUrl(project.thumbnail_url);
      setPreviewVideoUrl(project.preview_video_url || '');
      setSoftwareIcons(project.software_icons || []);
      setSelectedTags(project.tags?.map((t) => t.id) || []);
      setBlocks(project.description || []);
    }
  }, [project]);

  const fetchTags = async () => {
    if (!isSupabaseConfigured) {
      setAvailableTags(mockTags);
      return;
    }
    try {
      const { data, error } = await supabase.from('tags').select('*');
      if (error) throw error;
      setAvailableTags(data || []);
    } catch (err) {
      console.error('Error fetching tags:', err);
      setAvailableTags(mockTags);
    }
  };

  // --- Gestion des Champs ---
  const toggleSoftware = (software: string) => {
    setSoftwareIcons((prev) =>
      prev.includes(software) ? prev.filter((s) => s !== software) : [...prev, software]
    );
  };

  const toggleTag = (tagId: string) => {
    setSelectedTags((prev) =>
      prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId]
    );
  };

  // --- Gestion des Blocs de Contenu ---
  const handleAddBlock = (type: 'text' | 'image' | 'video' | 'audio') => {
    const newBlock: ContentBlock = {
      id: crypto.randomUUID(),
      type,
      content: '',
      order: blocks.length
    };
    setBlocks([...blocks, newBlock]);
  };

  const updateBlockContent = (id: string, content: string) => {
    setBlocks(blocks.map(b => b.id === id ? { ...b, content } : b));
  };

  const removeBlock = (id: string) => {
    setBlocks(blocks.filter(b => b.id !== id));
  };

  // --- Gestion de la Médiathèque ---
  const handleMediaSelect = (url: string, type: 'image' | 'video' | 'audio') => {
    if (activeBlockId) {
      // Modification d'un bloc existant
      updateBlockContent(activeBlockId, url);
    } else {
      // Création automatique si on n'éditait pas un bloc spécifique
      const newBlock: ContentBlock = {
        id: crypto.randomUUID(),
        type: type === 'text' ? 'image' : type, // Sécurité
        content: url,
        order: blocks.length
      };
      setBlocks([...blocks, newBlock]);
    }
    setIsMediaLibraryOpen(false);
    setActiveBlockId(null);
  };

  const openMediaLibraryForBlock = (blockId: string) => {
    setActiveBlockId(blockId);
    setIsMediaLibraryOpen(true);
  };

  const openMediaLibraryGlobal = () => {
    setActiveBlockId(null);
    setIsMediaLibraryOpen(true);
  };

  // --- Sauvegarde (Logique conservée) ---
  const handleSave = async () => {
    if (!title.trim() || !thumbnailUrl.trim()) {
      alert('Please fill in all required fields (Title & Thumbnail)');
      return;
    }

    setSaving(true);

    try {
      const projectData = {
        title: title.trim(),
        thumbnail_url: thumbnailUrl.trim(),
        preview_video_url: previewVideoUrl.trim() || null,
        software_icons: softwareIcons,
        description: blocks, // On sauvegarde les blocs JSON
        order_index: project?.order_index || 0
      };

      let projectId = project?.id;

      if (isSupabaseConfigured) {
        // 1. Insert ou Update le Projet
        if (project) {
          const { error } = await supabase
            .from('projects')
            .update(projectData)
            .eq('id', project.id);
          if (error) throw error;
        } else {
          const { data, error } = await supabase
            .from('projects')
            .insert([projectData])
            .select()
            .single();
          if (error) throw error;
          projectId = data.id;
        }

        // 2. Gestion des Tags (Relation Many-to-Many)
        if (projectId) {
          // On nettoie les anciens tags
          await supabase.from('project_tags').delete().eq('project_id', projectId);

          // On insère les nouveaux
          if (selectedTags.length > 0) {
            const projectTags = selectedTags.map((tagId) => ({
              project_id: projectId,
              tag_id: tagId
            }));
            await supabase.from('project_tags').insert(projectTags);
          }
        }
      } else {
        console.log('Mock Save:', projectData, selectedTags);
      }

      onSave();
    } catch (err) {
      console.error('Error saving project:', err);
      alert('Failed to save project');
    } finally {
      setSaving(false);
    }
  };

  // --- RENDER ---
  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-8 pb-20">
        
        {/* Header Fixe */}
        <div className="flex items-center justify-between sticky top-0 bg-black/90 backdrop-blur-md z-40 py-4 border-b border-zinc-800 -mx-4 px-4 md:-mx-8 md:px-8">
          <div className="flex items-center gap-4">
            <button onClick={onCancel} className="p-2 hover:bg-zinc-800 rounded-full transition-colors">
              <ArrowLeft />
            </button>
            <h1 className="text-xl md:text-2xl font-bold">
              {project ? 'Éditer le projet' : 'Nouveau projet'}
            </h1>
          </div>
          <div className="flex gap-2">
            <button
              onClick={openMediaLibraryGlobal}
              className="hidden sm:flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-md transition-colors text-sm"
            >
              <FolderOpen size={16} />
              <span>Médiathèque</span>
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-4 md:px-6 py-2 bg-white text-black font-bold rounded-md hover:bg-zinc-200 transition-colors disabled:opacity-50"
            >
              <Save size={18} />
              {saving ? '...' : 'Sauvegarder'}
            </button>
          </div>
        </div>

        {/* Formulaire Principal */}
        <div className="space-y-6 bg-zinc-900 p-6 rounded-xl border border-zinc-800">
          {/* Titre */}
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-2">Titre *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-700 rounded-md p-3 text-white focus:outline-none focus:border-white"
              placeholder="Titre du projet..."
            />
          </div>

          {/* Thumbnail & Preview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2">Miniature URL *</label>
              <div className="flex gap-2">
                <input
                  type="url"
                  value={thumbnailUrl}
                  onChange={(e) => setThumbnailUrl(e.target.value)}
                  className="flex-1 bg-zinc-950 border border-zinc-700 rounded-md p-3 text-white focus:outline-none focus:border-white text-sm"
                  placeholder="https://..."
                />
                <button 
                  onClick={() => openMediaLibraryGlobal()} 
                  className="p-3 bg-zinc-800 rounded-md hover:bg-zinc-700"
                  title="Choisir une image"
                >
                  <FolderOpen size={18} />
                </button>
              </div>
              {thumbnailUrl && (
                 <img src={thumbnailUrl} alt="Preview" className="mt-2 w-full h-32 object-cover rounded-md border border-zinc-800" />
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2">Preview Vidéo URL</label>
              <input
                type="url"
                value={previewVideoUrl}
                onChange={(e) => setPreviewVideoUrl(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-700 rounded-md p-3 text-white focus:outline-none focus:border-white text-sm"
                placeholder="https://..."
              />
            </div>
          </div>

          {/* Logiciels */}
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-2">Logiciels</label>
            <div className="flex flex-wrap gap-2">
              {SOFTWARE_OPTIONS.map((software) => (
                <button
                  key={software}
                  onClick={() => toggleSoftware(software)}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                    softwareIcons.includes(software)
                      ? 'bg-red-600 text-white'
                      : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                  }`}
                >
                  {software}
                </button>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-2">Tags</label>
            <div className="flex flex-wrap gap-2">
              {availableTags.map((tag) => (
                <button
                  key={tag.id}
                  onClick={() => toggleTag(tag.id)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                    selectedTags.includes(tag.id) ? 'opacity-100 ring-2 ring-white' : 'opacity-40 grayscale'
                  }`}
                  style={{ backgroundColor: tag.hex_color }}
                >
                  {tag.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Éditeur de Blocs (Contenu) */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-zinc-300">Contenu détaillé</h2>
          
          <Reorder.Group axis="y" values={blocks} onReorder={setBlocks} className="space-y-4">
            {blocks.map((block) => (
              <Reorder.Item key={block.id} value={block} className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden relative group">
                <div className="p-4 flex gap-4 items-start">
                  <div className="mt-2 cursor-grab active:cursor-grabbing text-zinc-600 hover:text-white">
                    <GripVertical size={20} />
                  </div>
                  
                  <div className="flex-1 space-y-2">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-xs uppercase font-bold text-zinc-500 tracking-wider flex items-center gap-2">
                            {block.type === 'text' && <Type size={14}/>}
                            {block.type === 'image' && <ImageIcon size={14}/>}
                            {block.type === 'video' && <Video size={14}/>}
                            {block.type === 'audio' && <Music size={14}/>}
                            {block.type} BLOCK
                        </span>
                        <button onClick={() => removeBlock(block.id)} className="text-zinc-600 hover:text-red-500 transition-colors">
                            <Trash2 size={16} />
                        </button>
                    </div>

                    {/* Inputs selon le type */}
                    {block.type === 'text' ? (
                      <textarea
                        value={block.content}
                        onChange={(e) => updateBlockContent(block.id, e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded p-3 min-h-[120px] text-zinc-300 focus:outline-none focus:border-zinc-600 resize-y"
                        placeholder="Écrivez votre texte ici..."
                      />
                    ) : (
                      <div className="flex gap-2 items-center">
                        <input
                            type="text"
                            value={block.content}
                            onChange={(e) => updateBlockContent(block.id, e.target.value)}
                            className="flex-1 bg-zinc-950 border border-zinc-800 rounded p-2 text-sm text-zinc-300 font-mono"
                            placeholder={`URL du fichier ${block.type}...`}
                        />
                        <button 
                            onClick={() => openMediaLibraryForBlock(block.id)}
                            className="p-2 bg-zinc-800 hover:bg-zinc-700 rounded text-zinc-300"
                            title="Choisir depuis la médiathèque"
                        >
                            <FolderOpen size={18} />
                        </button>
                      </div>
                    )}
                    
                    {/* Prévisualisations Editor */}
                    {block.content && block.type === 'image' && (
                        <img src={block.content} alt="Preview" className="h-24 w-auto rounded object-cover border border-zinc-800 mt-2" />
                    )}
                    {block.content && block.type === 'audio' && (
                        <div className="mt-2 p-3 bg-zinc-950 rounded border border-zinc-800 flex items-center gap-3 text-sm text-zinc-400">
                            <Music size={18} className="text-white" />
                            <span>Fichier Audio lié</span>
                            <audio src={block.content} controls className="h-8 w-48 ml-auto" />
                        </div>
                    )}
                  </div>
                </div>
              </Reorder.Item>
            ))}
          </Reorder.Group>

          {/* Boutons d'ajout */}
          <div className="flex flex-wrap gap-2 justify-center py-8 border-t border-zinc-800 border-dashed mt-8">
            <button onClick={() => handleAddBlock('text')} className="flex items-center gap-2 px-4 py-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-600 rounded-full transition-all text-sm text-zinc-300 hover:text-white">
              <Type size={16} /> Texte
            </button>
            <button onClick={() => handleAddBlock('image')} className="flex items-center gap-2 px-4 py-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-600 rounded-full transition-all text-sm text-zinc-300 hover:text-white">
              <ImageIcon size={16} /> Image
            </button>
            <button onClick={() => handleAddBlock('video')} className="flex items-center gap-2 px-4 py-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-600 rounded-full transition-all text-sm text-zinc-300 hover:text-white">
              <Video size={16} /> Vidéo
            </button>
            <button onClick={() => handleAddBlock('audio')} className="flex items-center gap-2 px-4 py-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-600 rounded-full transition-all text-sm text-zinc-300 hover:text-white">
              <Music size={16} /> Audio
            </button>
          </div>
        </div>

      </div>

      {/* Modal Médiathèque */}
      <MediaLibraryModal 
        isOpen={isMediaLibraryOpen}
        onClose={() => setIsMediaLibraryOpen(false)}
        onSelect={handleMediaSelect}
      />
    </div>
  );
}