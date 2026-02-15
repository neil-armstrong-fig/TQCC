import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://stirring-baklava-d1133c.netlify.app",
  base: "/",
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [sitemap()],
});
