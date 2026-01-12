import { defineCollection, z } from 'astro:content';

const conceptSchema = z.object({
  id: z.string(),
  phrase: z.string(),
  definition: z.string().optional(),
  connections: z.array(z.string()), // Array of concept IDs
});

const contentCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    category: z.enum(['identity', 'archive', 'curriculum', 'doctrine', 'dispatch']),
    date: z.string(),
    tags: z.array(z.string()),
    featured: z.boolean().default(false),
    excerpt: z.string(),
    concepts: z.array(conceptSchema).optional().default([]),
  }),
});

export const collections = {
  identity: contentCollection,
  archive: contentCollection,
  curriculum: contentCollection,
  doctrine: contentCollection,
  dispatch: contentCollection,
};