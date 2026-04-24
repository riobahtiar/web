import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const blogSchema = z.object({
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
});

const blogEn = defineCollection({
  loader: glob({ pattern: "**/[^_]*.{md,mdx}", base: "./src/content/blog-en" }),
  schema: blogSchema,
});

const blogId = defineCollection({
  loader: glob({ pattern: "**/[^_]*.{md,mdx}", base: "./src/content/blog-id" }),
  schema: blogSchema,
});

export const collections = {
  "blog-en": blogEn,
  "blog-id": blogId,
};
