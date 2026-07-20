import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://bolodb.dev',
  integrations: [
    react(),
    tailwind(),
    sitemap({
      serialize(item) {
        // Set root page priority to 1.0, others to 0.8
        const isRoot = item.url === 'https://bolodb.dev/';
        
        item.changefreq = 'weekly';
        item.priority = isRoot ? 1.0 : 0.8;
        
        return item;
      }
    })
  ],
  markdown: {
    shikiConfig: {
      theme: 'github-dark',
    },
  },
});
