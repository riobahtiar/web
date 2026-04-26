// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

import partytown from "@astrojs/partytown";
import sitemap from "@astrojs/sitemap";
import markdoc from "@astrojs/markdoc";
import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import cloudflare from "@astrojs/cloudflare";

export default defineConfig({
  site: "https://web.riomyid.workers.dev",
  output: "server",

  vite: {
    plugins: [tailwindcss()],
    resolve: {
      // React 19 on Cloudflare Workers: use the edge server bundle so
      // MessageChannel from node:worker_threads doesn't need polyfilling.
      alias: import.meta.env.PROD
        ? { "react-dom/server": "react-dom/server.edge" }
        : undefined,
    },
  },

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
    fallback: { id: "en" },
  },

  integrations: [partytown(), sitemap(), markdoc(), mdx(), react()],

  adapter: cloudflare({
    imageService: { build: "compile", runtime: "passthrough" },
  }),
});
