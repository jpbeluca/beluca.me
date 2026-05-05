import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import node from '@astrojs/node';

export default defineConfig({
  site: 'https://beluca.me',
  // Default static output. The Node adapter activates only for routes that
  // opt in with `export const prerender = false` (currently /api/agent).
  adapter: node({ mode: 'standalone' }),
  integrations: [mdx(), react(), sitemap()],
});
