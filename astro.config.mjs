// @ts-check
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind()],
  output: 'static', // Static site generation
  build: {
    inlineStylesheets: 'auto',
  },
  site: 'https://buildwhilebleeding.com',
});