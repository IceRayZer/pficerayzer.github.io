import { Project, Tag } from '../types';

export const mockTags: Tag[] = [
  { id: '1', label: 'Level Design', hex_color: '#e74c3c' },
  { id: '2', label: 'UX Design', hex_color: '#3498db' },
  { id: '3', label: 'Game Design', hex_color: '#2ecc71' },
  { id: '4', label: 'Prototyping', hex_color: '#f39c12' },
  { id: '5', label: 'FPS', hex_color: '#9b59b6' },
  { id: '6', label: 'Puzzle', hex_color: '#1abc9c' },
];

export const mockProjects: Project[] = [
  {
    id: '1',
    title: 'Cherche-vie',
    thumbnail_url: 'https://images.pexels.com/photos/7862464/pexels-photo-7862464.jpeg?auto=compress&cs=tinysrgb&w=800',
    preview_video_url: null,
    description: [
      {
        id: '1',
        type: 'text',
        content: 'Explorez un monde mystique en FPS, photographiez et déchiffrez une encyclopédie pour dévoiler ses secrets.',
        order: 0
      }
    ],
    software_icons: ['Unity', 'Figma'],
    tags: [mockTags[0], mockTags[2], mockTags[4]],
    order_index: 0
  },
  {
    id: '2',
    title: 'Dispin',
    thumbnail_url: 'https://images.pexels.com/photos/3761504/pexels-photo-3761504.jpeg?auto=compress&cs=tinysrgb&w=800',
    preview_video_url: null,
    description: [
      {
        id: '1',
        type: 'text',
        content: 'A unique puzzle game featuring rotating mechanics and mind-bending challenges.',
        order: 0
      }
    ],
    software_icons: ['Unity'],
    tags: [mockTags[2], mockTags[5]],
    order_index: 1
  },
  {
    id: '3',
    title: 'Krea-Tor',
    thumbnail_url: 'https://images.pexels.com/photos/8728558/pexels-photo-8728558.jpeg?auto=compress&cs=tinysrgb&w=800',
    preview_video_url: null,
    description: [
      {
        id: '1',
        type: 'text',
        content: 'Build and create in this innovative level editor and creative sandbox.',
        order: 0
      }
    ],
    software_icons: ['Unity', 'Blender'],
    tags: [mockTags[0], mockTags[2]],
    order_index: 2
  },
  {
    id: '4',
    title: 'NetRunners',
    thumbnail_url: 'https://images.pexels.com/photos/7915437/pexels-photo-7915437.jpeg?auto=compress&cs=tinysrgb&w=800',
    preview_video_url: null,
    description: [
      {
        id: '1',
        type: 'text',
        content: 'Cyberpunk-inspired multiplayer experience with fast-paced action.',
        order: 0
      }
    ],
    software_icons: ['Unity'],
    tags: [mockTags[0], mockTags[4]],
    order_index: 3
  },
  {
    id: '5',
    title: "Servi'Sandwich",
    thumbnail_url: 'https://images.pexels.com/photos/4254165/pexels-photo-4254165.jpeg?auto=compress&cs=tinysrgb&w=800',
    preview_video_url: null,
    description: [
      {
        id: '1',
        type: 'text',
        content: 'A quirky simulation game about running the perfect sandwich shop.',
        order: 0
      }
    ],
    software_icons: ['Unity', 'Figma'],
    tags: [mockTags[2], mockTags[3]],
    order_index: 4
  },
  {
    id: '6',
    title: "Sherlock golm's",
    thumbnail_url: 'https://images.pexels.com/photos/163036/mario-luigi-yoschi-figures-163036.jpeg?auto=compress&cs=tinysrgb&w=800',
    preview_video_url: null,
    description: [
      {
        id: '1',
        type: 'text',
        content: 'Mystery-solving adventure with intricate puzzles and compelling narrative.',
        order: 0
      }
    ],
    software_icons: ['Unity', 'Figma'],
    tags: [mockTags[2], mockTags[5]],
    order_index: 5
  }
];
