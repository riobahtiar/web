import { useState, useMemo } from "react";

interface BlogPost {
  slug: string;
  data: {
    title: string;
    description: string;
    created_at: Date;
    image?: string;
    category: string;
    tags: string[];
    author: {
      name: string;
      image: string;
    };
  };
}

interface Props {
  posts: BlogPost[];
  lang: string;
  baseUrl: string;
}

export default function BlogSearch({ posts, lang, baseUrl }: Props) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPosts = useMemo(() => {
    if (!searchQuery.trim()) {
      return posts;
    }

    const query = searchQuery.toLowerCase();
    return posts.filter((post) => {
      const titleMatch = post.data.title.toLowerCase().includes(query);
      const descriptionMatch = post.data.description
        .toLowerCase()
        .includes(query);
      const categoryMatch = post.data.category.toLowerCase().includes(query);
      const tagsMatch = post.data.tags.some((tag) =>
        tag.toLowerCase().includes(query),
      );

      return titleMatch || descriptionMatch || categoryMatch || tagsMatch;
    });
  }, [searchQuery, posts]);

  const formatDate = (date: Date): string => {
    return new Date(date).toLocaleDateString(
      lang === "id" ? "id-ID" : "en-US",
      {
        year: "numeric",
        month: "long",
        day: "numeric",
      },
    );
  };

  return (
    <div className="w-full">
      {/* Search Input */}
      <div className="mb-8">
        <div className="relative">
          <input
            type="text"
            placeholder={
              lang === "id"
                ? "Cari artikel berdasarkan judul, kategori, atau tag..."
                : "Search articles by title, category, or tag..."
            }
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input input-bordered w-full pr-4 pl-12"
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 opacity-60"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="btn btn-ghost btn-xs btn-circle absolute top-1/2 right-4 -translate-y-1/2"
              aria-label="Clear search"
            >
              ✕
            </button>
          )}
        </div>
        {searchQuery && (
          <p className="mt-2 text-sm opacity-70">
            {lang === "id"
              ? `Menampilkan ${filteredPosts.length} dari ${posts.length} artikel`
              : `Showing ${filteredPosts.length} of ${posts.length} articles`}
          </p>
        )}
      </div>

      {/* Posts Grid */}
      <div className="grid gap-12">
        {filteredPosts.length > 0 ? (
          filteredPosts.map((post) => {
            // Clean the slug to remove category prefix if needed
            let cleanSlug = post.slug;
            if (cleanSlug.startsWith(post.data.category + "/")) {
              cleanSlug = cleanSlug.substring(post.data.category.length + 1);
            }

            return (
              <article key={post.slug} className="grid gap-8 md:grid-cols-3">
                {post.data.image && (
                  <a
                    href={`${baseUrl}/${post.data.category}/${cleanSlug}`}
                    className="block md:col-span-1"
                  >
                    <div className="relative aspect-[16/9] overflow-hidden rounded-xl">
                      <img
                        src={post.data.image}
                        alt={post.data.title}
                        className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                        width="400"
                        height="225"
                      />
                    </div>
                  </a>
                )}

                <div
                  className={
                    post.data.image ? "md:col-span-2" : "md:col-span-3"
                  }
                >
                  <div className="mb-3 flex items-center gap-4">
                    <a
                      href={`${baseUrl}/${post.data.category}`}
                      className="hover:text-primary transition-colors"
                    >
                      {post.data.category}
                    </a>
                    <span>•</span>
                    <time
                      dateTime={new Date(post.data.created_at).toISOString()}
                    >
                      {formatDate(post.data.created_at)}
                    </time>
                  </div>

                  <h2 className="!mt-0 !mb-3 text-2xl font-bold">
                    <a
                      href={`${baseUrl}/${post.data.category}/${cleanSlug}`}
                      className="hover:text-primary transition-colors"
                    >
                      {post.data.title}
                    </a>
                  </h2>

                  <p className="!mt-0 line-clamp-2 opacity-80">
                    {post.data.description}
                  </p>

                  <div className="mt-4 flex items-center gap-3">
                    <img
                      src={post.data.author.image}
                      alt={post.data.author.name}
                      width="32"
                      height="32"
                      className="rounded-full"
                    />
                    <span>{post.data.author.name}</span>
                  </div>

                  {/* Tags */}
                  {post.data.tags && post.data.tags.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {post.data.tags.map((tag) => (
                        <a
                          key={tag}
                          href={`${baseUrl}/tag/${tag}`}
                          className="badge badge-outline badge-sm hover:badge-primary transition-colors"
                        >
                          {tag}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </article>
            );
          })
        ) : (
          <div className="py-12 text-center">
            <p className="text-lg opacity-70">
              {lang === "id"
                ? "Tidak ada artikel yang ditemukan."
                : "No articles found."}
            </p>
            <button
              onClick={() => setSearchQuery("")}
              className="btn btn-primary btn-sm mt-4"
            >
              {lang === "id" ? "Hapus Pencarian" : "Clear Search"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
