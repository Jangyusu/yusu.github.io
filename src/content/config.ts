import { z, defineCollection } from 'astro:content';

const postCollection = defineCollection({
  schema: z.object({
    title: z.string(),
    category: z.string(),
    createDate: z.date(),
  }),
});

export const collections = {
  post: postCollection,
};
