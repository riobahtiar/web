// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

import icon from "astro-icon";

import partytown from "@astrojs/partytown";

import sitemap from "@astrojs/sitemap";

import markdoc from "@astrojs/markdoc";

import mdx from "@astrojs/mdx";

export default defineConfig({
  vite: {
      plugins: [tailwindcss()],
  },

  i18n: {
      defaultLocale: "en",
      locales: ["en", "id"],
      routing: {
          prefixDefaultLocale: false,
          strategy: "pathname"
      },
      fallback: {
          id: "en"
      }
  },

  integrations: [icon(), partytown(), sitemap(), markdoc(), mdx()],
  experimental: {
    svg: true,
  },
});