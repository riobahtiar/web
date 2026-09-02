/**
 * The stack shown in the homepage marquee.
 *
 * `icon` is an Iconify name resolved by astro-icon. Brand marks come from
 * `simple-icons`, which is monochrome and inherits `currentColor`, so the row
 * stays on the site's palette in both themes. Typesense has no simple-icons
 * mark, so `src/icons/typesense.svg` provides a local one.
 */
export interface Tech {
  name: string;
  icon: string;
}

export const technology = {
  frontend: [
    { name: "Astro", icon: "simple-icons:astro" },
    { name: "Vue.js", icon: "simple-icons:vuedotjs" },
    { name: "Nuxt.js", icon: "simple-icons:nuxtdotjs" },
    { name: "React", icon: "simple-icons:react" },
    { name: "Tailwind CSS", icon: "simple-icons:tailwindcss" },
  ],
  backend: [
    { name: "Bun", icon: "simple-icons:bun" },
    { name: "Node.js", icon: "simple-icons:nodedotjs" },
    { name: "Hono", icon: "simple-icons:hono" },
    { name: "Elysia.js", icon: "elysiajs" },
    { name: "Laravel", icon: "simple-icons:laravel" },
    { name: "WordPress", icon: "simple-icons:wordpress" },
  ],
  mobile: [
    { name: "Flutter", icon: "simple-icons:flutter" },
    // React Native's brand mark is the React atom; simple-icons has no separate
    // entry, and tabler's is stroke-based so it would read thin beside these.
    { name: "React Native", icon: "simple-icons:react" },
  ],
  database: [
    { name: "PostgreSQL", icon: "simple-icons:postgresql" },
    { name: "MySQL", icon: "simple-icons:mysql" },
    { name: "Redis", icon: "simple-icons:redis" },
    { name: "Elasticsearch", icon: "simple-icons:elasticsearch" },
    { name: "Typesense", icon: "typesense" },
    { name: "Supabase", icon: "simple-icons:supabase" },
  ],
  cloud: [
    { name: "AWS", icon: "simple-icons:amazonwebservices" },
    { name: "Google Cloud", icon: "simple-icons:googlecloud" },
    { name: "Alibaba Cloud", icon: "simple-icons:alibabacloud" },
    { name: "Cloudflare", icon: "simple-icons:cloudflare" },
    { name: "DigitalOcean", icon: "simple-icons:digitalocean" },
    { name: "Vercel", icon: "simple-icons:vercel" },
    { name: "Railway", icon: "simple-icons:railway" },
    { name: "WorkOS", icon: "workos" },
  ],
  ai: [
    { name: "Anthropic", icon: "simple-icons:anthropic" },
    { name: "OpenAI", icon: "simple-icons:openai" },
    { name: "OpenRouter", icon: "simple-icons:openrouter" },
  ],
} satisfies Record<string, Tech[]>;

/** Every tool, in declaration order. */
export const stack: Tech[] = [
  ...technology.backend,
  ...technology.frontend,
  ...technology.mobile,
  ...technology.database,
  ...technology.cloud,
  ...technology.ai,
];

/**
 * A new order per call. The site is SSR with no HTML caching, so calling this
 * while rendering gives a fresh order on every page load without any client
 * JavaScript, and with no reflow after paint.
 */
export function shuffledStack(): Tech[] {
  const items = [...stack];

  // Fisher-Yates: every permutation equally likely.
  for (let i = items.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [items[i], items[j]] = [items[j]!, items[i]!];
  }

  return items;
}
