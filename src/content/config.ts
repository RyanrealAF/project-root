import { defineCollection, z } from 'astro:content';

const contentCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    category: z.enum(['identity', 'archive', 'curriculum', 'doctrine', 'dispatch']),
    date: z.string(),
    tags: z.array(z.string()),
    featured: z.boolean().default(false),
    excerpt: z.string(),
  }),
});

export const collections = {
  identity: contentCollection,
  archive: contentCollection,
  curriculum: contentCollection,
  doctrine: contentCollection,
  dispatch: contentCollection,
};