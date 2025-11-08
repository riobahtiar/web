// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

import icon from "astro-icon";

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
      // Use react-dom/server.edge instead of react-dom/server.browser for React 19.
      // Without this, MessageChannel from node:worker_threads needs to be polyfilled.
      alias: import.meta.env.PROD
        ? {
            "react-dom/server": "react-dom/server.edge",
          }
        : undefined,
    },
  },

  markdown: {
    shikiConfig: {
      // Choose from Shiki's built-in themes (or add your own)
      // https://shiki.style/themes
      themes: {
        light: "github-light",
        dark: "github-dark",
      },
      // Enable word wrap to prevent horizontal scrolling
      wrap: true,
      // Add custom languages if needed
      // langs: [],
    },
  },

  i18n: {
    defaultLocale: "en",
    locales: ["en", "id"],
    routing: {
      prefixDefaultLocale: false,
    },
    fallback: {
      id: "en",
    },
  },

  integrations: [icon(), partytown(), sitemap(), markdoc(), mdx(), react()],

  image: {
    responsiveStyles: true,
  },

  adapter: cloudflare({
    imageService: "passthrough",
    platformProxy: {
      enabled: true,
    },
  }),
});
