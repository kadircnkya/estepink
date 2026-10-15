import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// Yazı tiplerini önceden yükleme eklentisi
function preloadFonts(): Plugin {
  const wanted = [
    /instrument-serif-latin-400-normal.*\.woff2$/,
    /instrument-serif-latin-400-italic.*\.woff2$/,
    /dm-sans-latin-400-normal.*\.woff2$/,
  ];
  return {
    name: 'estepink-preload-fonts',
    apply: 'build',
    transformIndexHtml: {
      order: 'post',
      handler(_html, ctx) {
        if (!ctx.bundle) return [];
        return Object.keys(ctx.bundle)
          .filter((file) => wanted.some((re) => re.test(file)))
          .map((file) => ({
            tag: 'link',
            attrs: { rel: 'preload', as: 'font', type: 'font/woff2', href: `/${file}`, crossorigin: '' },
            injectTo: 'head' as const,
          }));
      },
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), preloadFonts()],
  server: {
    proxy: {
      // Contact form → backend (cd backend && npm run dev)
      '/api': 'http://localhost:3001',
    },
  },
  build: {
    target: 'es2020',
    chunkSizeWarningLimit: 1600,
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          if (id.includes('node_modules/three')) return 'three';
          if (id.includes('node_modules/@react-three')) return 'r3f';
          return undefined;
        },
      },
    },
  },
});
