// Mapping des noms de logiciels vers leurs icônes
// Nous utilisons lucide-react pour la plupart, et simple-icons pour les logos officiels

import {
    // On importe les icônes de base de Lucide
    Box,
    Figma,
    Blend,
    Film,
    Image as ImageIcon,
    Palette
} from 'lucide-react';

// Type pour les icônes
type IconComponent = React.ComponentType<{ size?: number; className?: string }>;

// Map des logiciels vers leurs composants d'icônes
export const SOFTWARE_ICONS: Record<string, { icon: IconComponent; label: string; color?: string }> = {
    'Unity': {
        icon: Box, // On utilisera l'icône simple-icons après installation
        label: 'Unity',
        color: '#000000'
    },
    'Figma': {
        icon: Figma,
        label: 'Figma',
        color: '#F24E1E'
    },
    'Blender': {
        icon: Blend,
        label: 'Blender',
        color: '#F5792A'
    },
    'Unreal Engine': {
        icon: Box,
        label: 'Unreal Engine',
        color: '#0E1128'
    },
    'Photoshop': {
        icon: ImageIcon,
        label: 'Photoshop',
        color: '#31A8FF'
    },
    'Illustrator': {
        icon: Palette,
        label: 'Illustrator',
        color: '#FF9A00'
    },
    'After Effects': {
        icon: Film,
        label: 'After Effects',
        color: '#9999FF'
    },
    'Premiere Pro': {
        icon: Film,
        label: 'Premiere Pro',
        color: '#9999FF'
    }
};

// Liste de tous les logiciels disponibles
export const SOFTWARE_OPTIONS = Object.keys(SOFTWARE_ICONS);
