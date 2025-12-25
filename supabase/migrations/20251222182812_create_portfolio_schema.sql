/*
  # Portfolio Database Schema

  1. New Tables
    - `tags`
      - `id` (uuid, primary key)
      - `label` (text, unique) - Tag name
      - `hex_color` (text) - Color for tag display
      - `created_at` (timestamptz)
    
    - `projects`
      - `id` (uuid, primary key)
      - `title` (text) - Project title
      - `thumbnail_url` (text) - Main thumbnail image
      - `preview_video_url` (text, nullable) - Video/GIF preview URL
      - `description` (jsonb) - Block-based content (text, image, video blocks)
      - `software_icons` (text array) - Software used (Unity, Figma, etc.)
      - `order_index` (integer) - For custom ordering
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `project_tags`
      - `project_id` (uuid, foreign key)
      - `tag_id` (uuid, foreign key)
      - Primary key on (project_id, tag_id)

  2. Security
    - Enable RLS on all tables
    - Public read access for projects and tags (portfolio is public)
    - Only authenticated users can modify data (admin access)
*/

-- Create tags table
CREATE TABLE IF NOT EXISTS tags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  label text UNIQUE NOT NULL,
  hex_color text NOT NULL DEFAULT '#3b82f6',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE tags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view tags"
  ON tags FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert tags"
  ON tags FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update tags"
  ON tags FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete tags"
  ON tags FOR DELETE
  TO authenticated
  USING (true);

-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  thumbnail_url text NOT NULL,
  preview_video_url text,
  description jsonb DEFAULT '[]'::jsonb,
  software_icons text[] DEFAULT ARRAY[]::text[],
  order_index integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view projects"
  ON projects FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert projects"
  ON projects FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update projects"
  ON projects FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete projects"
  ON projects FOR DELETE
  TO authenticated
  USING (true);

-- Create project_tags junction table
CREATE TABLE IF NOT EXISTS project_tags (
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
  tag_id uuid REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (project_id, tag_id)
);

ALTER TABLE project_tags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view project tags"
  ON project_tags FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert project tags"
  ON project_tags FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete project tags"
  ON project_tags FOR DELETE
  TO authenticated
  USING (true);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_projects_order ON projects(order_index DESC);
CREATE INDEX IF NOT EXISTS idx_project_tags_project ON project_tags(project_id);
CREATE INDEX IF NOT EXISTS idx_project_tags_tag ON project_tags(tag_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for projects table
DROP TRIGGER IF EXISTS update_projects_updated_at ON projects;
CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();