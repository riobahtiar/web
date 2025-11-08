import type { CollectionEntry } from "astro:content";

/**
 * Find related posts based on shared tags
 * @param currentPost - The current blog post
 * @param allPosts - All blog posts in the same collection
 * @param limit - Maximum number of related posts to return (default: 3)
 * @returns Array of related posts sorted by relevance
 */
export function getRelatedPosts<
  T extends CollectionEntry<"blog-en"> | CollectionEntry<"blog-id">,
>(currentPost: T, allPosts: T[], limit: number = 3): T[] {
  const currentTags = currentPost.data.tags;
  const currentSlug = currentPost.slug;

  // Calculate relevance score for each post
  const postsWithScore = allPosts
    .filter((post) => post.slug !== currentSlug) // Exclude current post
    .map((post) => {
      // Count shared tags
      const sharedTags = post.data.tags.filter((tag) =>
        currentTags.includes(tag),
      );
      let score = sharedTags.length;

      // Boost score if in same category
      if (post.data.category === currentPost.data.category) {
        score += 0.5;
      }

      // Slightly prefer newer posts (recency bonus)
      const daysSincePublished = Math.floor(
        (Date.now() - post.data.created_at.getTime()) / (1000 * 60 * 60 * 24),
      );
      const recencyBonus = Math.max(0, 1 - daysSincePublished / 365); // Bonus decreases over a year
      score += recencyBonus * 0.2;

      return {
        post,
        score,
        sharedTags,
      };
    })
    .filter((item) => item.score > 0) // Only include posts with at least some relevance
    .sort((a, b) => b.score - a.score) // Sort by score descending
    .slice(0, limit); // Limit results

  return postsWithScore.map((item) => item.post);
}

/**
 * Get related posts with reading time included
 * @param currentPost - The current blog post
 * @param allPosts - All blog posts in the same collection
 * @param limit - Maximum number of related posts to return (default: 3)
 * @param lang - Language for reading time calculation
 * @returns Array of related posts with reading time
 */
export async function getRelatedPostsWithReadingTime<
  T extends CollectionEntry<"blog-en"> | CollectionEntry<"blog-id">,
>(
  currentPost: T,
  allPosts: T[],
  limit: number = 3,
  lang: "en" | "id" = "en",
): Promise<Array<T & { readingTime: string }>> {
  const { getReadingTimeI18n } = await import("./readingTime");
  const relatedPosts = getRelatedPosts(currentPost, allPosts, limit);

  return relatedPosts.map((post) => ({
    ...post,
    readingTime: getReadingTimeI18n(post.body, lang),
  }));
}
