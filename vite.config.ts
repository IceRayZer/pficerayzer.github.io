import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  // Base path pour GitHub Pages
  // Note: Comme le repo (pficerayzer.github.io) diffère du username (IceRayZer),
  // le site est servi sous /pficerayzer.github.io/ et non à la racine.
  base: '/pficerayzer.github.io/',
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  build: {
    // Force les chemins relatifs
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        // Utilise des chemins relatifs pour tous les assets
        assetFileNames: 'assets/[name]-[hash].[ext]',
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
      },
    },
  },
});
