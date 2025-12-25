# Netflix-Style Portfolio for UX/Level Designer

A stunning, production-ready portfolio website inspired by Netflix's interface, built with modern web technologies.

## Features

### Public Portfolio
- **Netflix-Style Card Interactions**: Smooth hover animations with Framer Motion that reveal project details
- **Video Previews**: Auto-playing videos on hover for immersive previews
- **Smart Filtering**: Filter projects by software tools (Unity, Figma, Blender, etc.)
- **Wishlist System**: Session-based wishlist using localStorage
- **Bilingual Support**: Toggle between English and French
- **Shuffle Feature**: Randomly discover projects
- **Responsive Design**: Mobile-first approach with beautiful dark theme (#141414 background)

### Admin Dashboard
- **Secure Authentication**: Supabase-powered login system
- **Block-Based Editor**: Create rich project descriptions with:
  - Text blocks for descriptions
  - Image blocks for screenshots
  - Video blocks for embedded content
- **Tag Manager**: Create and manage tags with custom colors using a color picker
- **Drag & Drop**: Reorder content blocks with smooth animations
- **Project Management**: Full CRUD operations for projects
- **Real-time Preview**: See changes immediately

## Tech Stack

- **Framework**: Vite + React 18 + TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Backend**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth

## Database Schema

### Tables
- `projects`: Store project data with block-based descriptions (JSONB)
- `tags`: Manage colored tags for categorization
- `project_tags`: Many-to-many relationship between projects and tags

### Security
- Row Level Security (RLS) enabled on all tables
- Public read access for portfolio viewing
- Authenticated write access for admin operations

## Getting Started

### Prerequisites
- Node.js 18+
- Supabase account (already configured)

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The portfolio will be available at `http://localhost:5173`

### Building for Production

```bash
npm run build
npm run preview
```

## Deployment

### Netlify
The project includes `netlify.toml` for easy deployment:
1. Push to GitHub
2. Connect your repository to Netlify
3. Environment variables are automatically configured
4. Deploy!

### Vercel
The project includes `vercel.json` for easy deployment:
1. Push to GitHub
2. Import your repository in Vercel
3. Environment variables are automatically configured
4. Deploy!

## Admin Access

To access the admin dashboard:
1. Click the user icon in the navigation
2. Sign in with your Supabase credentials
3. Manage projects and tags

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── BlockEditor.tsx      # Block-based content editor
│   ├── Navbar.tsx           # Main navigation
│   ├── ProjectCard.tsx      # Netflix-style card
│   ├── ProjectEditor.tsx    # Project creation/editing
│   ├── ProjectModal.tsx     # Full project view
│   ├── SoftwareFilter.tsx   # Filter by software
│   └── TagManager.tsx       # Tag CRUD operations
├── hooks/               # Custom React hooks
│   ├── useProjects.ts       # Project data management
│   └── useWishlist.ts       # Wishlist functionality
├── lib/                 # Utilities and configuration
│   ├── mockData.ts          # Fallback data
│   ├── supabase.ts          # Supabase client
│   └── translations.ts      # i18n strings
├── pages/               # Main views
│   ├── AdminDashboard.tsx   # Admin panel
│   ├── AdminLogin.tsx       # Login page
│   └── Portfolio.tsx        # Main portfolio view
├── types/               # TypeScript definitions
│   └── index.ts
└── App.tsx              # Main app component
```

## Key Features Explained

### Netflix Card Effect
The signature hover effect is achieved using Framer Motion's `layoutId` and `AnimatePresence`:
- Cards scale up and increase z-index on hover
- Smooth transition from thumbnail to expanded view
- Split layout: video preview on top, details on bottom
- Colored tag badges and action buttons

### Block-Based Content Editor
Inspired by modern CMS systems:
- Add text, image, or video blocks
- Drag to reorder blocks
- Live preview of images
- JSONB storage in Supabase for flexibility

### Mock Data Fallback
The app gracefully handles missing Supabase configuration by falling back to mock data, allowing immediate UI preview.

## Customization

### Colors
The app uses a dark Netflix-inspired palette:
- Background: `#141414` (zinc-950)
- Cards: `#262626` (zinc-900)
- Accent: `#e50914` (red-600)

### Software Icons
Add more software options in `ProjectEditor.tsx`:
```typescript
const SOFTWARE_OPTIONS = ['Unity', 'Figma', 'Your Tool'];
```

### Tag Colors
Preset colors in `TagManager.tsx`:
```typescript
const PRESET_COLORS = ['#e74c3c', '#3498db', ...];
```

## Performance Optimizations

- Lazy loading of images
- Optimized re-renders with React.memo
- Efficient filtering with useMemo
- Smooth 60fps animations with Framer Motion

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## License

MIT
