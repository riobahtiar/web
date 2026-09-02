import type { CollectionEntry } from "astro:content";

import { getCollection } from "astro:content";

export type BlogCollection = "blog-en" | "blog-id";
export type BlogEntry = CollectionEntry<BlogCollection>;

export const POSTS_PER_PAGE = 10;

export interface Pagination {
  currentPage: number;
  totalPages: number;
  url: {
    prev?: string;
    next?: string;
  };
}

/**
 * Published posts for a collection, newest first. Drafts stay visible under
 * `astro dev` so they can be previewed, and are dropped from production builds.
 */
export async function getPublishedPosts<C extends BlogCollection>(
  collection: C,
): Promise<CollectionEntry<C>[]> {
  const posts = await getCollection(
    collection,
    ({ data }) => import.meta.env.DEV || !data.draft,
  );

  return posts.sort(
    (a, b) => b.data.created_at.valueOf() - a.data.created_at.valueOf(),
  );
}

/** Strip the leading `<category>/` the glob loader keeps in `entry.id`. */
export function getPostSlug(post: BlogEntry): string {
  const prefix = `${post.data.category}/`;

  return post.id.startsWith(prefix) ? post.id.slice(prefix.length) : post.id;
}

/** Category names with post counts, for the blog sidebar. */
export function getCategoryCounts(
  posts: BlogEntry[],
): { name: string; count: number }[] {
  const counts = new Map<string, number>();

  for (const post of posts) {
    counts.set(post.data.category, (counts.get(post.data.category) ?? 0) + 1);
  }

  return [...counts].map(([name, count]) => ({ name, count }));
}

/** Parse a `[page]` route param into a positive integer, defaulting to 1. */
export function parsePageParam(value: string | undefined): number {
  const page = Number.parseInt(value ?? "1", 10);

  return Number.isInteger(page) && page > 0 ? page : 1;
}

/**
 * Slice `posts` to a page and build the prev/next URLs. Page 1 lives at
 * `baseUrl` itself so `/blog` and `/blog/page/1` never diverge.
 */
export function paginatePosts<T>(
  posts: T[],
  page: number,
  baseUrl: string,
): { posts: T[]; pagination: Pagination } {
  const totalPages = Math.max(1, Math.ceil(posts.length / POSTS_PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * POSTS_PER_PAGE;

  const pageUrl = (n: number) => (n === 1 ? baseUrl : `${baseUrl}/page/${n}`);

  return {
    posts: posts.slice(start, start + POSTS_PER_PAGE),
    pagination: {
      currentPage,
      totalPages,
      url: {
        prev: currentPage > 1 ? pageUrl(currentPage - 1) : undefined,
        next: currentPage < totalPages ? pageUrl(currentPage + 1) : undefined,
      },
    },
  };
}

const IMAGE_MIME_TYPES: Record<string, string> = {
  avif: "image/avif",
  gif: "image/gif",
  jpeg: "image/jpeg",
  jpg: "image/jpeg",
  png: "image/png",
  svg: "image/svg+xml",
  webp: "image/webp",
};

/** MIME type for an RSS `<enclosure>`, guessed from the file extension. */
export function getImageMimeType(path: string): string {
  const extension = path.split(".").pop()?.toLowerCase() ?? "";

  return IMAGE_MIME_TYPES[extension] ?? "application/octet-stream";
}
