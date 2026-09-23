# TQCC Website — Agent Instructions

Astro 5 + Tailwind 4 site (Node version in `.nvmrc`). These instructions apply to any coding agent.

## Commands

- `npm run dev` starts the dev server.
- `npm run build` builds the site; run it to verify changes.
- `npx astro check` runs type checking.

## Distance & Speed Values

**All distances and speeds displayed to users must be hooked up to the miles/km toggle switch.**

The site has a unit preference system (`src/lib/units.ts`) with a central update script in `src/layouts/BaseLayout.astro`. To hook up a value, wrap it in a `<span>` with the appropriate class and data attribute — never render distances or speeds as plain text.

### Patterns

| Type | Class | Data attribute | Example |
|------|-------|----------------|---------|
| Distance string (e.g. "44 miles") | `distance-string` | `data-distance="44 miles"` | `<span class="distance-string" data-distance="44 miles">44 miles</span>` |
| Speed/pace string (e.g. "15–16 mph") | `pace-string` | `data-pace="15–16 mph"` | `<span class="pace-string" data-pace="15–16 mph">15–16 mph</span>` |
| Distance from Strava (meters) | `distance-display` | `data-meters="70000"` | `<span class="distance-display" data-meters="70000">…</span>` |
| Speed from Strava (meters + seconds) | `speed-display` | `data-meters="…" data-seconds="…"` | `<span class="speed-display" data-meters="…" data-seconds="…">…</span>` |
| Elevation string (e.g. "1154 feet") | `elevation-string` | `data-elevation="1154 feet"` | `<span class="elevation-string" data-elevation="1154 feet">1154 ft</span>` |
| Elevation from Strava (meters) | `elevation-display` | `data-elevation-meters="350"` | `<span class="elevation-display" data-elevation-meters="350">…</span>` |

### Notes
- For inline prose (e.g. "covering approximately 44 miles"), wrap just the distance portion in a `distance-string` span.
- Distances embedded inside markdown body content rendered via `<Content />` cannot be auto-converted — avoid hardcoding distances in markdown body text, or phrase them without units where possible.
- The data attribute always stores the **original miles/mph value** as a string; the JS converts it on page load and on toggle.
- Always use miles (not km) in content files and data attributes, as miles is the default unit.

## Sitemap

The sitemap is generated automatically by `@astrojs/sitemap` at build time (configured in `astro.config.mjs`).

**Keep the `filter` exclusion list up to date.** Whenever a new page is added, decide whether it should be publicly indexed:
- Public pages (rides, events, about, membership, etc.) — no action needed, included by default.
- Password-gated or admin pages — add a `!page.includes("/your-path")` condition to the `filter` in `astro.config.mjs`.

Currently excluded: `/admin`, `/members` (and all sub-paths).

## Copy Style

- Prefer **commas** over **em dashes** (—) for mid-sentence asides and parenthetical clauses in website copy.

## External Links

- When referencing an external organisation, venue, or resource in content, **link to their website** where possible.
- All external links must open in a **new tab** (`target="_blank" rel="noopener noreferrer"`).
- In markdown content files, use inline HTML `<a>` tags (not markdown link syntax) so that `target="_blank"` can be set.

## Newsletter Images

Newsletter hero images (`heroImage` in `src/content/newsletters/*.md`, stored in `public/images/uploads/`) often come from screenshots and have a dark/semi-transparent strip baked into the **right edge**, which shows as a visible bar on the homepage card. **Whenever a new newsletter is added, check and fix its image:**

- Inspect the rightmost pixel columns at a few header rows (e.g. y=0, 100) and compare with the left edge. The yellow header band should run to the edge; a run of dark (`5,21,36` / black) or semi-transparent columns on the right is the artifact.
- Crop those columns off (including the anti-aliased column) with `sharp` (`extract({ left: 0, top: 0, width: width - n, height })`), overwriting the file.
- Don't paper over it with a dark card background; fix the image itself.
- Past crops: September 2026 (6px), March (10px), April (11px). JPEGs have been fine so far.
