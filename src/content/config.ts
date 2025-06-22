import { defineCollection, z } from "astro:content";

const blogCollection = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    description: z.string(),
    created_at: z.date(),
    modified_at: z.date(),
    image: z.string().optional(),
    category: z.string(),
    tags: z.array(z.string()),
    author: z.object({
      name: z.string(),
      image: z.string(),
      bio: z.string(),
    }),
    draft: z.boolean().default(false),
  }),
});

export const collections = {
  "blog-en": blogCollection,
  "blog-id": blogCollection,
};
