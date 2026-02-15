import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";

// Detect build environment
const isNetlify = process.env.NETLIFY === "true";

export default defineConfig({
  site: isNetlify
    ? "https://stirring-baklava-d1133c.netlify.app"
    : "https://neil-armstrong-fig.github.io",
  base: isNetlify ? "/" : "/TQCC",
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [sitemap()],
});
