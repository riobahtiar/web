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
    { name: "TypeScript", icon: "simple-icons:typescript" },
    { name: "Vue.js", icon: "simple-icons:vuedotjs" },
    { name: "Nuxt", icon: "simple-icons:nuxtdotjs" },
    { name: "React", icon: "simple-icons:react" },
    { name: "Next.js", icon: "simple-icons:nextdotjs" },
    { name: "Tailwind CSS", icon: "simple-icons:tailwindcss" },
  ],
  backend: [
    { name: "Bun", icon: "simple-icons:bun" },
    { name: "Elysia.js", icon: "elysiajs" },
    { name: "Better Auth", icon: "simple-icons:betterauth" },
    { name: "Go", icon: "simple-icons:go" },
    { name: "Node.js", icon: "simple-icons:nodedotjs" },
    { name: "Hono", icon: "simple-icons:hono" },
    { name: "Laravel", icon: "simple-icons:laravel" },
    { name: "WordPress", icon: "simple-icons:wordpress" },
  ],
  data: [
    { name: "PostgreSQL", icon: "simple-icons:postgresql" },
    { name: "MySQL", icon: "simple-icons:mysql" },
    { name: "Drizzle", icon: "simple-icons:drizzle" },
    { name: "Redis", icon: "simple-icons:redis" },
    { name: "Typesense", icon: "typesense" },
    { name: "BigQuery", icon: "simple-icons:googlebigquery" },
    { name: "MongoDB", icon: "simple-icons:mongodb" },
  ],
  infrastructure: [
    { name: "Docker", icon: "simple-icons:docker" },
    { name: "Kubernetes", icon: "simple-icons:kubernetes" },
    { name: "AWS", icon: "simple-icons:amazonwebservices" },
    { name: "Cloudflare", icon: "simple-icons:cloudflare" },
    { name: "DigitalOcean", icon: "simple-icons:digitalocean" },
    { name: "Grafana", icon: "simple-icons:grafana" },
    { name: "Sentry", icon: "simple-icons:sentry" },
  ],
  delivery: [
    { name: "GitHub Actions", icon: "simple-icons:githubactions" },
    { name: "Turborepo", icon: "simple-icons:turborepo" },
    { name: "Vitest", icon: "simple-icons:vitest" },
  ],
  ai: [
    { name: "Claude Code", icon: "simple-icons:claude" },
    { name: "Codex", icon: "simple-icons:openai" },
  ],
} satisfies Record<string, Tech[]>;

/** Every tool, in declaration order. */
export const stack: Tech[] = [
  ...technology.frontend,
  ...technology.backend,
  ...technology.data,
  ...technology.infrastructure,
  ...technology.delivery,
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
