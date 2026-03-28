import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";

// Detect build environment
const isNetlify = process.env.NETLIFY === "true";

export default defineConfig({
  site: isNetlify
    ? "https://stirring-baklava-d1133c.netlify.app"
    : "https://www.titanicquartercc.com",
  base: "/",
  prefetch: {
    prefetchAll: false,
    defaultStrategy: "hover",
  },
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [
    sitemap({
      // Exclude password-gated and admin pages — keep this list updated
      // when new pages are added that shouldn't be publicly indexed.
      filter: (page) =>
        !page.includes("/admin") &&
        !page.includes("/members") &&
        !page.includes("/ni-boccia-league") &&
        !page.includes("/news") &&
        !page.includes("/faqs") &&
        !page.includes("/data-deletion"),
    }),
  ],
});
