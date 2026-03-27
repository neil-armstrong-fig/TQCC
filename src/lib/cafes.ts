export interface Cafe {
  id: number;
  name: string;
  lat: number;
  lon: number;
  openingHours: string;
  phone: string;
  website: string;
  town: string;
}

/**
 * Club-curated cafes with details that can't be fetched automatically.
 * These are merged with other data (curated entries take priority by name+town).
 *
 * To add a new cafe: add an entry below with a unique negative id.
 * Find lat/lon from Google Maps (right-click → coordinates).
 */
const CURATED_CAFES: Cafe[] = [
  {
    id: -1,
    name: "Oxford Island",
    lat: 54.4957,
    lon: -6.3850,
    openingHours: "We-Su 10:00-16:00",
    phone: "028 3832 2205",
    website: "https://getactiveabc.com/facility/oxfordisland/",
    town: "Craigavon",
  },
  {
    id: -2,
    name: "Fodder",
    lat: 54.35939650625592,
    lon: -5.708678369656502,
    openingHours: "Mo-Tu 09:00-16:00; Th-Fr 09:00-16:00; Sa 09:00-16:00; Su 10:00-16:00; We off",
    phone: "",
    website: "http://www.fodderni.com/",
    town: "Downpatrick",
  },
];

/**
 * Fetches cafe/restaurant data from the FSA Food Hygiene Rating API.
 * This is the primary data source — free, no API key, covers every registered
 * food business in NI. Includes lat/lon and address data.
 */
async function fetchFSACafes(): Promise<Cafe[]> {
  const cafes: Cafe[] = [];
  const pageSize = 200;
  let page = 1;
  let totalPages = 1;

  try {
    while (page <= totalPages) {
      const url = `https://api.ratings.food.gov.uk/Establishments?businessTypeId=1&countryId=2&pageSize=${pageSize}&pageNumber=${page}`;
      const resp = await fetch(url, {
        headers: {
          "x-api-version": "2",
          "accept": "application/json",
        },
      });

      if (!resp.ok) {
        console.warn(`FSA API returned ${resp.status} on page ${page}`);
        break;
      }

      const data = await resp.json();
      totalPages = data.meta.totalPages;

      for (const e of data.establishments) {
        const lat = parseFloat(e.geocode?.latitude);
        const lon = parseFloat(e.geocode?.longitude);
        if (!lat || !lon || !e.BusinessName) continue;

        // Build town from address lines (FSA uses AddressLine3 or AddressLine2 for town)
        const town = e.AddressLine3 || e.AddressLine2 || "";

        cafes.push({
          id: e.FHRSID,
          name: e.BusinessName,
          lat,
          lon,
          openingHours: "",
          phone: "",
          website: "",
          town,
        });
      }

      page++;
    }

    console.log(`FSA API: fetched ${cafes.length} establishments across ${totalPages} pages`);
  } catch (err) {
    console.warn("Failed to fetch from FSA API:", err);
  }

  return cafes;
}

/**
 * Fetches cafes from OSM Overpass API for enrichment (opening hours, phone, website).
 */
async function fetchOSMCafes(): Promise<Cafe[]> {
  const query = `[out:json][timeout:60];
area["name"="Northern Ireland"]->.ni;
(
  node["amenity"="cafe"](area.ni);
  way["amenity"="cafe"](area.ni);
  node["shop"="coffee"](area.ni);
  way["shop"="coffee"](area.ni);
);
out body center;`;

  try {
    const resp = await fetch("https://overpass-api.de/api/interpreter", {
      method: "POST",
      body: new URLSearchParams({ data: query }),
    });

    if (!resp.ok) {
      console.warn(`Overpass API returned ${resp.status}`);
      return [];
    }

    const data = await resp.json();
    const elements: any[] = data.elements || [];
    const seen = new Set<number>();

    return elements
      .map((el: any) => {
        if (seen.has(el.id)) return null;
        seen.add(el.id);

        const lat = el.lat || el.center?.lat;
        const lon = el.lon || el.center?.lon;
        if (!lat || !lon) return null;

        const tags = el.tags || {};
        if (!tags.name) return null;

        return {
          id: el.id,
          name: tags.name,
          lat,
          lon,
          openingHours: tags.opening_hours || "",
          phone: tags.phone || tags["contact:phone"] || "",
          website: tags.website || tags["contact:website"] || "",
          town: tags["addr:city"] || tags["addr:town"] || tags["addr:village"] || tags["addr:suburb"] || "",
        } satisfies Cafe;
      })
      .filter((c): c is Cafe => c !== null);
  } catch (err) {
    console.warn("Failed to fetch from Overpass:", err);
    return [];
  }
}

/**
 * Fetches cafes from FSA (primary) and OSM (enrichment), then merges with curated list.
 * Called at build time — refreshed daily via GitHub Actions cron.
 */
export async function fetchNorthernIrelandCafes(): Promise<Cafe[]> {
  // Fetch both sources in parallel
  const [fsaCafes, osmCafes] = await Promise.all([
    fetchFSACafes(),
    fetchOSMCafes(),
  ]);

  // Build OSM lookup by approximate location (within ~100m)
  // Used to enrich FSA entries with opening hours, phone, website
  const osmByKey = new Map<string, Cafe>();
  for (const c of osmCafes) {
    const key = `${c.lat.toFixed(3)},${c.lon.toFixed(3)}`;
    osmByKey.set(key, c);
  }

  // Also build a name-based lookup for OSM (for cases where coords don't match exactly)
  const osmByName = new Map<string, Cafe>();
  for (const c of osmCafes) {
    osmByName.set(c.name.toLowerCase(), c);
  }

  // Start with FSA cafes, enriched with OSM data where available
  const merged: Cafe[] = fsaCafes.map((fsa) => {
    const key = `${fsa.lat.toFixed(3)},${fsa.lon.toFixed(3)}`;
    const osmMatch = osmByKey.get(key) || osmByName.get(fsa.name.toLowerCase());

    if (osmMatch) {
      return {
        ...fsa,
        openingHours: osmMatch.openingHours || fsa.openingHours,
        phone: osmMatch.phone || fsa.phone,
        website: osmMatch.website || fsa.website,
        town: fsa.town || osmMatch.town,
      };
    }
    return fsa;
  });

  // Add OSM cafes that aren't in FSA data (by approximate location)
  const fsaKeys = new Set(fsaCafes.map((c) => `${c.lat.toFixed(3)},${c.lon.toFixed(3)}`));
  const fsaNames = new Set(fsaCafes.map((c) => c.name.toLowerCase()));
  for (const osm of osmCafes) {
    const key = `${osm.lat.toFixed(3)},${osm.lon.toFixed(3)}`;
    if (!fsaKeys.has(key) && !fsaNames.has(osm.name.toLowerCase())) {
      merged.push(osm);
    }
  }

  // Add curated cafes that aren't in either source
  const mergedNames = new Set(merged.map((c) => c.name.toLowerCase()));
  for (const curated of CURATED_CAFES) {
    if (!mergedNames.has(curated.name.toLowerCase())) {
      merged.push(curated);
    }
  }

  console.log(`Total cafes: ${merged.length} (FSA: ${fsaCafes.length}, OSM: ${osmCafes.length}, curated: ${CURATED_CAFES.length})`);
  return merged;
}
