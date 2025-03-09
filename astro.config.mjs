// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

import icon from "astro-icon";

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

  integrations: [icon()],
});