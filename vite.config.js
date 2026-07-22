import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// If you deploy to GitHub Pages as a project site (username.github.io/repo-name),
// change base to '/repo-name/'. For Vercel, Netlify, or a custom domain, './' is fine.
export default defineConfig({
  plugins: [react()],
  base: './',
});
