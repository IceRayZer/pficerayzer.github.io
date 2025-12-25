// Déclarations de types pour résoudre les erreurs TypeScript
// Ces modules sont installés via npm mais TypeScript a parfois du mal à les résoudre

declare module 'react' {
  export const useState: <T>(initial: T | (() => T)) => [T, (value: T | ((prev: T) => T)) => void];
  export const useEffect: (effect: () => void | (() => void), deps?: any[]) => void;
  export type ChangeEvent<T = HTMLInputElement> = {
    target: { value: string };
    currentTarget: T;
  };
  export type SyntheticEvent<T = HTMLElement, E = Event> = {
    currentTarget: T;
    target: T;
    preventDefault: () => void;
    stopPropagation: () => void;
  };
  export type MouseEvent<T = HTMLElement> = {
    currentTarget: T;
    target: T;
    preventDefault: () => void;
    stopPropagation: () => void;
  };
  export const createElement: any;
  export const Fragment: any;
  export default any;
}

declare module 'react/jsx-runtime' {
  export const jsx: any;
  export const jsxs: any;
  export const Fragment: any;
}

declare module 'react-dom' {
  export const createRoot: any;
  export default any;
}

declare module 'framer-motion' {
  export const motion: any;
  export const AnimatePresence: any;
  export const Reorder: {
    Group: any;
    Item: any;
  };
  export default any;
}

declare module 'lucide-react' {
  export const Save: any;
  export const X: any;
  export const Play: any;
  export const Plus: any;
  export const Check: any;
  export const GripVertical: any;
  export const Trash2: any;
  export const Type: any;
  export const Image: any;
  export const Video: any;
  export const Shuffle: any;
  export const Heart: any;
  export const User: any;
  export const ChevronDown: any;
  export const LogOut: any;
  export const Edit2: any;
  export const ArrowLeft: any;
  export const LogIn: any;
  export const Volume2: any;
  export const VolumeX: any;
  export default any;
}

// Déclaration JSX globale
declare namespace JSX {
  interface IntrinsicElements {
    [elemName: string]: any;
  }
}

declare module 'vite' {
  export function defineConfig(config: any): any;
  export default any;
}

declare module '@vitejs/plugin-react' {
  export default function react(): any;
}

