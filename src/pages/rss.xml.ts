import type { APIRoute } from "astro";

import rss from "@astrojs/rss";

import {
  getImageMimeType,
  getPostSlug,
  getPublishedPosts,
} from "@/utils/posts";

export const GET: APIRoute = async (context) => {
  const posts = await getPublishedPosts("blog-en");
  const site = context.site;

  return rss({
    title: "Rio Bahtiar | Blog",
    description:
      "Full-stack developer sharing insights about web development, programming, and technology.",
    site: site?.toString() || "https://rio.my.id",
    items: posts.map((post) => {
      const image = post.data.image;
      const imageUrl = image && site ? new URL(image, site).toString() : image;

      return {
        title: post.data.title,
        description: post.data.description,
        pubDate: post.data.created_at,
        link: `/blog/${post.data.category}/${getPostSlug(post)}`,
        categories: [post.data.category, ...post.data.tags],
        author: post.data.author.name,
        customData: imageUrl
          ? `<enclosure url="${imageUrl}" type="${getImageMimeType(imageUrl)}" />`
          : "",
      };
    }),
    customData: `<language>en-us</language>`,
    xmlns: {
      atom: "http://www.w3.org/2005/Atom",
    },
  });
};
