import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  // site: 'https://bolodb.dev',
  site: 'https://BoloDB.github.io',
  base: '/bolodb-landing-page/',
  integrations: [react(), tailwind(), sitemap()],
  markdown: {
    shikiConfig: {
      theme: 'github-dark',
    },
  },
});
