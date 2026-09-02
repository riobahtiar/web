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
    { name: "Laravel", icon: "simple-icons:laravel" },
    { name: "WordPress", icon: "simple-icons:wordpress" },
  ],
  database: [
    { name: "PostgreSQL", icon: "simple-icons:postgresql" },
    { name: "MySQL", icon: "simple-icons:mysql" },
    { name: "Redis", icon: "simple-icons:redis" },
    { name: "Elasticsearch", icon: "simple-icons:elasticsearch" },
    { name: "Typesense", icon: "typesense" },
  ],
  cloud: [
    { name: "AWS", icon: "simple-icons:amazonwebservices" },
    { name: "Google Cloud", icon: "simple-icons:googlecloud" },
    { name: "DigitalOcean", icon: "simple-icons:digitalocean" },
  ],
  ai: [
    { name: "Anthropic", icon: "simple-icons:anthropic" },
    { name: "OpenAI", icon: "simple-icons:openai" },
  ],
} satisfies Record<string, Tech[]>;

/** Flat, display-ordered list for the marquee. */
export const stack: Tech[] = [
  ...technology.backend,
  ...technology.frontend,
  ...technology.database,
  ...technology.cloud,
  ...technology.ai,
];
