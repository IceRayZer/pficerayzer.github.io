import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, X } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { mockTags } from '../lib/mockData';
import { Project, Tag, ContentBlock } from '../types';
import { BlockEditor } from './BlockEditor';

interface ProjectEditorProps {
  project?: Project;
  onSave: () => void;
  onCancel: () => void;
}

const SOFTWARE_OPTIONS = ['Unity', 'Figma', 'Blender', 'Unreal Engine', 'Photoshop', 'Illustrator'];

export function ProjectEditor({ project, onSave, onCancel }: ProjectEditorProps) {
  const [title, setTitle] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [previewVideoUrl, setPreviewVideoUrl] = useState('');
  const [softwareIcons, setSoftwareIcons] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [blocks, setBlocks] = useState<ContentBlock[]>([]);
  const [availableTags, setAvailableTags] = useState<Tag[]>([]);
  const [saving, setSaving] = useState(false);

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

  const toggleSoftware = (software: string) => {
    setSoftwareIcons((prev) =>
      prev.includes(software)
        ? prev.filter((s) => s !== software)
        : [...prev, software]
    );
  };

  const toggleTag = (tagId: string) => {
    setSelectedTags((prev) =>
      prev.includes(tagId)
        ? prev.filter((id) => id !== tagId)
        : [...prev, tagId]
    );
  };

  const handleSave = async () => {
    if (!title.trim() || !thumbnailUrl.trim()) {
      alert('Please fill in all required fields');
      return;
    }

    if (!isSupabaseConfigured) {
      console.log('Mock: Save project', {
        title,
        thumbnailUrl,
        previewVideoUrl,
        softwareIcons,
        blocks,
        tags: selectedTags
      });
      onSave();
      return;
    }

    setSaving(true);

    try {
      const projectData = {
        title: title.trim(),
        thumbnail_url: thumbnailUrl.trim(),
        preview_video_url: previewVideoUrl.trim() || null,
        software_icons: softwareIcons,
        description: blocks,
        order_index: project?.order_index || 0
      };

      let projectId = project?.id;

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

      if (projectId) {
        await supabase
          .from('project_tags')
          .delete()
          .eq('project_id', projectId);

        if (selectedTags.length > 0) {
          const projectTags = selectedTags.map((tagId) => ({
            project_id: projectId,
            tag_id: tagId
          }));

          await supabase.from('project_tags').insert(projectTags);
        }
      }

      onSave();
    } catch (err) {
      console.error('Error saving project:', err);
      alert('Failed to save project');
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 z-[200] flex items-center justify-center p-4 overflow-y-auto"
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        className="w-full max-w-4xl bg-zinc-900 rounded-lg p-6 my-8 space-y-6"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">
            {project ? 'Edit Project' : 'New Project'}
          </h2>
          <motion.button
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            onClick={onCancel}
            className="p-2 hover:bg-zinc-800 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-white" />
          </motion.button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-red-600"
              placeholder="Project title..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Thumbnail URL *
            </label>
            <input
              type="url"
              value={thumbnailUrl}
              onChange={(e) => setThumbnailUrl(e.target.value)}
              className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-red-600"
              placeholder="https://..."
            />
            {thumbnailUrl && (
              <img
                src={thumbnailUrl}
                alt="Thumbnail preview"
                className="mt-2 w-full h-40 object-cover rounded-md"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Preview Video URL
            </label>
            <input
              type="url"
              value={previewVideoUrl}
              onChange={(e) => setPreviewVideoUrl(e.target.value)}
              className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-red-600"
              placeholder="https://..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Software
            </label>
            <div className="flex flex-wrap gap-2">
              {SOFTWARE_OPTIONS.map((software) => (
                <motion.button
                  key={software}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => toggleSoftware(software)}
                  className={`px-4 py-2 rounded-md font-medium transition-colors ${
                    softwareIcons.includes(software)
                      ? 'bg-red-600 text-white'
                      : 'bg-zinc-800 text-gray-300 hover:bg-zinc-700'
                  }`}
                >
                  {software}
                </motion.button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Tags
            </label>
            <div className="flex flex-wrap gap-2">
              {availableTags.map((tag) => (
                <motion.button
                  key={tag.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => toggleTag(tag.id)}
                  className={`px-4 py-2 rounded-full font-medium text-white transition-opacity ${
                    selectedTags.includes(tag.id) ? 'opacity-100' : 'opacity-50'
                  }`}
                  style={{ backgroundColor: tag.hex_color }}
                >
                  {tag.label}
                </motion.button>
              ))}
            </div>
          </div>

          <BlockEditor blocks={blocks} onChange={setBlocks} />
        </div>

        <div className="flex gap-3 pt-4 border-t border-zinc-800">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 disabled:bg-zinc-700 text-white font-semibold rounded-md transition-colors"
          >
            <Save className="w-5 h-5" />
            {saving ? 'Saving...' : 'Save Project'}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onCancel}
            className="px-6 py-3 bg-zinc-800 hover:bg-zinc-700 text-white font-semibold rounded-md transition-colors"
          >
            Cancel
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}
