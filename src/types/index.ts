export interface Tag {
  id: string;
  label: string;
  hex_color: string;
  created_at?: string;
}

export type BlockType = 'text' | 'image' | 'video' | 'audio'; // <--- Ajout de 'audio'

export interface ContentBlock {
  id: string;
  type: BlockType;
  content: string;
  order: number;
}

export interface Project {
  id: string;
  title: string;
  thumbnail_url: string;
  preview_video_url: string | null;
  brief_description?: string | null;
  description: ContentBlock[];
  software_icons: string[];
  tags?: Tag[];
  order_index: number;
  created_at?: string;
  updated_at?: string;
}

export interface ProjectWithTags extends Project {
  tags: Tag[];
}

export type Language = 'en' | 'fr';

export interface Translations {
  en: {
    [key: string]: string;
  };
  fr: {
    [key: string]: string;
  };
}