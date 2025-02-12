import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/proxy': {
        target: 'http://16.171.137.96:7251',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/proxy/, ''), // Optional, to adjust path
      },
    },
  },
});
