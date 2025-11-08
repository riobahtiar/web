import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import type { APIRoute } from "astro";

export const GET: APIRoute = async (context) => {
  const posts = await getCollection("blog-en");

  // Sort posts by date (newest first)
  const sortedPosts = posts.sort(
    (a, b) => b.data.created_at.getTime() - a.data.created_at.getTime(),
  );

  return rss({
    title: "Rio Bahtiar | Blog",
    description:
      "Full-stack developer sharing insights about web development, programming, and technology.",
    site: context.site?.toString() || "https://riomy.id",
    items: sortedPosts.map((post) => {
      // Clean slug
      const slug = post.slug.startsWith(post.data.category + "/")
        ? post.slug.substring(post.data.category.length + 1)
        : post.slug;

      return {
        title: post.data.title,
        description: post.data.description,
        pubDate: post.data.created_at,
        link: `/blog/${post.data.category}/${slug}`,
        categories: [post.data.category, ...post.data.tags],
        author: post.data.author.name,
        customData: post.data.image
          ? `<enclosure url="${context.site ? new URL(post.data.image, context.site).toString() : post.data.image}" type="image/jpeg" />`
          : "",
      };
    }),
    customData: `<language>en-us</language>`,
    xmlns: {
      atom: "http://www.w3.org/2005/Atom",
    },
  });
};
