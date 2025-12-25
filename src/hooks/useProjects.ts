import { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { mockProjects } from '../lib/mockData';
import { Project } from '../types';

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  async function fetchProjects() {
    if (!isSupabaseConfigured) {
      setProjects(mockProjects);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data: projectsData, error: projectsError } = await supabase
        .from('projects')
        .select('*')
        .order('order_index', { ascending: false });

      if (projectsError) throw projectsError;

      const projectsWithTags = await Promise.all(
        (projectsData || []).map(async (project) => {
          const { data: projectTags } = await supabase
            .from('project_tags')
            .select('tag_id')
            .eq('project_id', project.id);

          if (projectTags && projectTags.length > 0) {
            const tagIds = projectTags.map((pt) => pt.tag_id);
            const { data: tags } = await supabase
              .from('tags')
              .select('*')
              .in('id', tagIds);

            return {
              ...project,
              tags: tags || []
            };
          }

          return {
            ...project,
            tags: []
          };
        })
      );

      setProjects(projectsWithTags);
      setError(null);
    } catch (err) {
      console.error('Error fetching projects:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch projects');
      setProjects(mockProjects);
    } finally {
      setLoading(false);
    }
  }

  return { projects, loading, error, refetch: fetchProjects };
}
