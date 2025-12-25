import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, Plus, Edit2, Trash2, ArrowLeft } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { useProjects } from '../hooks/useProjects';
import { Project } from '../types';
import { ProjectEditor } from '../components/ProjectEditor';
import { TagManager } from '../components/TagManager';

interface AdminDashboardProps {
  onLogout: () => void;
  onBackToPortfolio: () => void;
}

export function AdminDashboard({ onLogout, onBackToPortfolio }: AdminDashboardProps) {
  const { projects, loading, refetch } = useProjects();
  const [editingProject, setEditingProject] = useState<Project | undefined>();
  const [isCreating, setIsCreating] = useState(false);
  const [activeTab, setActiveTab] = useState<'projects' | 'tags'>('projects');

  const handleLogout = async () => {
    if (isSupabaseConfigured) {
      await supabase.auth.signOut();
    }
    onLogout();
  };

  const handleDelete = async (projectId: string) => {
    if (!confirm('Are you sure you want to delete this project?')) {
      return;
    }

    if (!isSupabaseConfigured) {
      console.log('Mock: Delete project', projectId);
      refetch();
      return;
    }

    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectId);

      if (error) throw error;
      refetch();
    } catch (err) {
      console.error('Error deleting project:', err);
      alert('Failed to delete project');
    }
  };

  const handleSave = () => {
    setEditingProject(undefined);
    setIsCreating(false);
    refetch();
  };

  return (
    <div className="min-h-screen bg-zinc-950">
      <nav className="bg-zinc-900 border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onBackToPortfolio}
                className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-md transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Back to Portfolio</span>
              </motion.button>
              <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </motion.button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="flex gap-4 border-b border-zinc-800">
          <button
            onClick={() => setActiveTab('projects')}
            className={`px-6 py-3 font-semibold transition-colors ${
              activeTab === 'projects'
                ? 'text-red-500 border-b-2 border-red-500'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Projects
          </button>
          <button
            onClick={() => setActiveTab('tags')}
            className={`px-6 py-3 font-semibold transition-colors ${
              activeTab === 'tags'
                ? 'text-red-500 border-b-2 border-red-500'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Tags
          </button>
        </div>

        {activeTab === 'projects' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">Projects</h2>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsCreating(true)}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors"
              >
                <Plus className="w-5 h-5" />
                New Project
              </motion.button>
            </div>

            {loading ? (
              <div className="text-center py-12 text-gray-400">Loading...</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {projects.map((project) => (
                  <motion.div
                    key={project.id}
                    layout
                    className="bg-zinc-900 rounded-lg overflow-hidden border border-zinc-800 hover:border-zinc-700 transition-colors"
                  >
                    <div className="aspect-video relative">
                      <img
                        src={project.thumbnail_url}
                        alt={project.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-4 space-y-3">
                      <h3 className="text-white font-semibold">{project.title}</h3>
                      <div className="flex flex-wrap gap-2">
                        {project.tags?.map((tag) => (
                          <span
                            key={tag.id}
                            className="px-2 py-1 rounded-full text-xs text-white"
                            style={{ backgroundColor: tag.hex_color }}
                          >
                            {tag.label}
                          </span>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setEditingProject(project)}
                          className="flex items-center gap-2 px-3 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-md text-sm transition-colors flex-1"
                        >
                          <Edit2 className="w-4 h-4" />
                          Edit
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleDelete(project.id)}
                          className="flex items-center gap-2 px-3 py-2 bg-red-900/20 hover:bg-red-900/40 text-red-400 rounded-md text-sm transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'tags' && (
          <div className="max-w-3xl">
            <TagManager />
          </div>
        )}
      </main>

      <AnimatePresence>
        {(isCreating || editingProject) && (
          <ProjectEditor
            project={editingProject}
            onSave={handleSave}
            onCancel={() => {
              setIsCreating(false);
              setEditingProject(undefined);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
