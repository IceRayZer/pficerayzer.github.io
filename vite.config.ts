import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  // Base path pour GitHub Pages (repository nommé username.github.io)
  base: '/',
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  build: {
    // Force les chemins relatifs pour éviter les URLs absolues
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        // Utilise des chemins relatifs pour tous les assets
        assetFileNames: 'assets/[name].[ext]',
        chunkFileNames: 'assets/[name].js',
        entryFileNames: 'assets/[name].js',
      },
    },
  },
});
