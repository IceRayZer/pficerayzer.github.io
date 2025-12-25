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
});
