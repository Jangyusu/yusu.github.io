import { z, defineCollection } from 'astro:content';

const postCollection = defineCollection({
  schema: z.object({
    id: z.number(),
    title: z.string(),
    category: z.string(),
    createDate: z.date(),
  }),
});

export const collections = {
  post: postCollection,
};
