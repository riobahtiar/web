// @ts-check
import { defineConfig, fontProviders } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

import icon from "astro-icon";
import partytown from "@astrojs/partytown";
import sitemap from "@astrojs/sitemap";
import mdx from "@astrojs/mdx";
import solid from "@astrojs/solid-js";
import cloudflare from "@astrojs/cloudflare";

export default defineConfig({
  site: "https://web.riomyid.workers.dev",
  output: "server",

  vite: {
    plugins: [tailwindcss()],

    // Every astro command defaults to the same node_modules/.vite. Running
    // `build` or `check` while a dev server is live rewrites the shared SSR dep
    // cache, and the Cloudflare workerd module runner goes on requesting the
    // old hash:
    //   The file does not exist at ".../deps_ssr/<mod>.js?v=<hash>"
    // The dev server never recovers from that, so only `dev` gets that cache
    // and every other command works in its own.
    cacheDir: process.argv.includes("dev")
      ? "node_modules/.vite"
      : "node_modules/.vite-cli",
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

  integrations: [icon(), partytown(), sitemap(), mdx(), solid()],

  adapter: cloudflare({
    imageService: { build: "compile", runtime: "passthrough" },
  }),
});
