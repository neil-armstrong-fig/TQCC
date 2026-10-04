import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";

const sitemapExclusions = [
  "/admin",
  "/members",
  "/ni-boccia-league",
  "/news",
  "/faqs",
  "/data-deletion",
  "/events/summer-solstice-sportive-2026",
];

export default defineConfig({
  // Canonicals, Open Graph URLs, structured data, and the sitemap must always
  // identify the public site, including in builds made by preview hosts.
  site: "https://www.titanicquartercc.com",
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
      filter: (page) => {
        const pathname = new URL(page).pathname.replace(/\/$/, "") || "/";
        return !sitemapExclusions.some(
          (excludedPath) => pathname === excludedPath || pathname.startsWith(`${excludedPath}/`),
        );
      },
    }),
  ],
});
