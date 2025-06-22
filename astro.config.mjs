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
  site: 'https://web.riomyid.workers.dev',
  output: 'static',
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      // Use react-dom/server.edge instead of react-dom/server.browser for React 19.
      // Without this, MessageChannel from node:worker_threads needs to be polyfilled.
      alias: import.meta.env.PROD && {
          'react-dom/server': 'react-dom/server.edge',
      },
    },
  },

  i18n: {
    defaultLocale: "en",
    locales: ["en", "id"],
    routing: {
      prefixDefaultLocale: false,
      strategy: "pathname",
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
    imageService: 'cloudflare',
    platformProxy: {
      enabled: true,
    },
  }),
});
