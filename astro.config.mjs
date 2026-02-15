import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://neil-armstrong-fig.github.io",
  base: import.meta.env.PROD ? "/TQCC" : "/",
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [sitemap()],
});
