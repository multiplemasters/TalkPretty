import path from 'node:path';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';

// BASE_PATH is set by the GitHub Pages workflow (e.g. "/talk-pretty/").
// Locally it defaults to "/".
const base = process.env.BASE_PATH ?? '/';
const port = Number(process.env.PORT ?? 5173);

export default defineConfig({
  base,
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, 'src'),
    },
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
  server: { port },
  preview: { port },
});
