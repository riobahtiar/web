// @ts-check
import { defineConfig, fontProviders } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

import icon from "astro-icon";
import partytown from "@astrojs/partytown";
import sitemap from "@astrojs/sitemap";
import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import cloudflare from "@astrojs/cloudflare";

export default defineConfig({
  site: "https://web.riomyid.workers.dev",
  output: "server",

  vite: {
    plugins: [tailwindcss()],

    environments: {
      ssr: {
        optimizeDeps: {
          // @astrojs/react only pre-bundles react, react-dom and
          // react-dom/server for the SSR environment when noDiscovery is
          // explicitly false (see its configEnvironment hook). Left on the
          // default, React is discovered lazily instead.
          noDiscovery: false,
        },
        resolve: {
          // SSR externalises CJS node_modules by default, so an island
          // importing "react" resolved to the raw CJS build while
          // react-dom/server came from the optimized bundle. Two copies of
          // React means a null hook dispatcher, i.e. "Invalid hook call" as
          // soon as an island renders on the server. Vite 8 reads these per
          // environment, so a top-level `ssr.noExternal` never applies.
          noExternal: ["react", "react-dom"],
          dedupe: ["react", "react-dom"],
        },
      },
    },

    resolve: {
      dedupe: ["react", "react-dom"],
      // React 19 on Cloudflare Workers: use the edge server bundle so
      // MessageChannel from node:worker_threads doesn't need polyfilling.
      alias: import.meta.env.PROD
        ? { "react-dom/server": "react-dom/server.edge" }
        : undefined,
    },
  },

  // Self-hosted and subset by Astro, so no third-party font request at runtime.
  fonts: [
    {
      provider: fontProviders.fontsource(),
      name: "Inter",
      cssVariable: "--font-inter",
      weights: ["400 700"],
      styles: ["normal"],
      subsets: ["latin"],
      fallbacks: ["system-ui", "sans-serif"],
    },
    {
      provider: fontProviders.fontsource(),
      name: "JetBrains Mono",
      cssVariable: "--font-jetbrains-mono",
      weights: ["400 600"],
      styles: ["normal"],
      subsets: ["latin"],
      fallbacks: ["ui-monospace", "monospace"],
    },
  ],

  markdown: {
    shikiConfig: {
      themes: { light: "github-light", dark: "github-dark" },
      wrap: true,
    },
  },

  i18n: {
    defaultLocale: "en",
    locales: ["en", "id"],
    routing: { prefixDefaultLocale: false },
    // Falls back to the English route when an Indonesian one is missing, which
    // is what serves untranslated blog posts. The side effect is that every
    // Indonesian 404 redirects to its English URL, so a localized 404 page can
    // never render; `src/pages/404.astro` covers both locales.
    fallback: { id: "en" },
  },

  integrations: [icon(), partytown(), sitemap(), mdx(), react()],

  adapter: cloudflare({
    imageService: { build: "compile", runtime: "passthrough" },
  }),
});
