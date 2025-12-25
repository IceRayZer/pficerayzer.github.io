import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, Edit2, Check, X } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { mockTags } from '../lib/mockData';
import { Tag } from '../types';

const PRESET_COLORS = [
  '#e74c3c', '#3498db', '#2ecc71', '#f39c12', '#9b59b6',
  '#1abc9c', '#e67e22', '#95a5a6', '#34495e', '#16a085'
];

export function TagManager() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newLabel, setNewLabel] = useState('');
  const [newColor, setNewColor] = useState(PRESET_COLORS[0]);

  useEffect(() => {
    fetchTags();
  }, []);

  const fetchTags = async () => {
    if (!isSupabaseConfigured) {
      setTags(mockTags);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('tags')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTags(data || []);
    } catch (err) {
      console.error('Error fetching tags:', err);
      setTags(mockTags);
    }
  };

  const handleCreate = async () => {
    if (!newLabel.trim()) return;

    if (!isSupabaseConfigured) {
      console.log('Mock: Create tag', { label: newLabel, color: newColor });
      setIsCreating(false);
      setNewLabel('');
      return;
    }

    try {
      const { error } = await supabase
        .from('tags')
        .insert([{ label: newLabel.trim(), hex_color: newColor }]);

      if (error) throw error;

      await fetchTags();
      setIsCreating(false);
      setNewLabel('');
      setNewColor(PRESET_COLORS[0]);
    } catch (err) {
      console.error('Error creating tag:', err);
      alert('Failed to create tag');
    }
  };

  const handleUpdate = async (id: string) => {
    if (!newLabel.trim()) return;

    if (!isSupabaseConfigured) {
      console.log('Mock: Update tag', id, { label: newLabel, color: newColor });
      setEditingId(null);
      setNewLabel('');
      return;
    }

    try {
      const { error } = await supabase
        .from('tags')
        .update({ label: newLabel.trim(), hex_color: newColor })
        .eq('id', id);

      if (error) throw error;

      await fetchTags();
      setEditingId(null);
      setNewLabel('');
      setNewColor(PRESET_COLORS[0]);
    } catch (err) {
      console.error('Error updating tag:', err);
      alert('Failed to update tag');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this tag? This will remove it from all projects.')) {
      return;
    }

    if (!isSupabaseConfigured) {
      console.log('Mock: Delete tag', id);
      return;
    }

    try {
      const { error } = await supabase.from('tags').delete().eq('id', id);

      if (error) throw error;
      await fetchTags();
    } catch (err) {
      console.error('Error deleting tag:', err);
      alert('Failed to delete tag');
    }
  };

  const startEdit = (tag: Tag) => {
    setEditingId(tag.id);
    setNewLabel(tag.label);
    setNewColor(tag.hex_color);
    setIsCreating(false);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setIsCreating(false);
    setNewLabel('');
    setNewColor(PRESET_COLORS[0]);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-white font-semibold">Tags</h3>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            setIsCreating(true);
            setEditingId(null);
            setNewLabel('');
            setNewColor(PRESET_COLORS[0]);
          }}
          className="flex items-center gap-2 px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Tag
        </motion.button>
      </div>

      <div className="space-y-2">
        {isCreating && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-zinc-800 rounded-lg p-4 space-y-3 border border-zinc-700"
          >
            <input
              type="text"
              value={newLabel}
              onChange={(e) => setNewLabel(e.target.value)}
              placeholder="Tag label..."
              className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-600"
              autoFocus
            />

            <div className="space-y-2">
              <label className="text-sm text-gray-400">Color:</label>
              <div className="flex gap-2">
                {PRESET_COLORS.map((color) => (
                  <button
                    key={color}
                    onClick={() => setNewColor(color)}
                    className={`w-8 h-8 rounded-full transition-transform ${
                      newColor === color ? 'ring-2 ring-white scale-110' : ''
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleCreate}
                className="flex items-center gap-2 px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md text-sm transition-colors"
              >
                <Check className="w-4 h-4" />
                Create
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={cancelEdit}
                className="flex items-center gap-2 px-3 py-2 bg-zinc-700 hover:bg-zinc-600 text-white rounded-md text-sm transition-colors"
              >
                <X className="w-4 h-4" />
                Cancel
              </motion.button>
            </div>
          </motion.div>
        )}

        {tags.map((tag) => (
          <motion.div
            key={tag.id}
            layout
            className="bg-zinc-800 rounded-lg p-3 border border-zinc-700"
          >
            {editingId === tag.id ? (
              <div className="space-y-3">
                <input
                  type="text"
                  value={newLabel}
                  onChange={(e) => setNewLabel(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-red-600"
                />

                <div className="space-y-2">
                  <label className="text-sm text-gray-400">Color:</label>
                  <div className="flex gap-2">
                    {PRESET_COLORS.map((color) => (
                      <button
                        key={color}
                        onClick={() => setNewColor(color)}
                        className={`w-8 h-8 rounded-full transition-transform ${
                          newColor === color ? 'ring-2 ring-white scale-110' : ''
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>

                <div className="flex gap-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleUpdate(tag.id)}
                    className="flex items-center gap-2 px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md text-sm transition-colors"
                  >
                    <Check className="w-4 h-4" />
                    Save
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={cancelEdit}
                    className="flex items-center gap-2 px-3 py-2 bg-zinc-700 hover:bg-zinc-600 text-white rounded-md text-sm transition-colors"
                  >
                    <X className="w-4 h-4" />
                    Cancel
                  </motion.button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <div
                  className="w-6 h-6 rounded-full"
                  style={{ backgroundColor: tag.hex_color }}
                />
                <span className="text-white flex-1">{tag.label}</span>
                <div className="flex gap-1">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => startEdit(tag)}
                    className="p-2 hover:bg-zinc-700 text-gray-400 hover:text-white rounded-md transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleDelete(tag.id)}
                    className="p-2 hover:bg-red-900/20 text-red-400 rounded-md transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
