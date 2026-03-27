export interface Town {
  name: string;
  lat: number;
  lon: number;
  type: string; // city, town, or village
}

/**
 * Fetches towns, villages, and cities in Northern Ireland from the Overpass API.
 * Called at build time so the data is baked into the static site.
 */
export async function fetchNorthernIrelandTowns(): Promise<Town[]> {
  const query = `[out:json][timeout:30];
area["name"="Northern Ireland"]->.ni;
(
  node["place"~"^(city|town|village)$"](area.ni);
);
out body;`;

  try {
    const resp = await fetch("https://overpass-api.de/api/interpreter", {
      method: "POST",
      body: new URLSearchParams({ data: query }),
    });

    if (!resp.ok) {
      console.warn(`Overpass API returned ${resp.status}, skipping town fetch`);
      return [];
    }

    const data = await resp.json();
    const elements: any[] = data.elements || [];

    return elements
      .map((el: any) => {
        if (!el.lat || !el.lon) return null;
        const tags = el.tags || {};
        if (!tags.name) return null;

        return {
          name: tags.name,
          lat: el.lat,
          lon: el.lon,
          type: tags.place,
        } satisfies Town;
      })
      .filter((t): t is Town => t !== null)
      .sort((a, b) => {
        // Sort: cities first, then towns, then villages
        const order: Record<string, number> = { city: 0, town: 1, village: 2 };
        return (order[a.type] ?? 3) - (order[b.type] ?? 3) || a.name.localeCompare(b.name);
      });
  } catch (err) {
    console.warn("Failed to fetch towns from Overpass:", err);
    return [];
  }
}
