export type BocciaCategory = "ni" | "uk" | "international";

export interface BocciaEvent {
  title: string;
  startDate: Date;
  endDate: Date;
  url: string;
  location?: string;
  description?: string;
  category: BocciaCategory;
}

interface SquarespaceEvent {
  title: string;
  startDate: number;
  endDate: number;
  urlId: string;
  body?: string;
  location?: {
    addressTitle?: string;
    addressLine1?: string;
    addressLine2?: string;
  };
}

interface BocciaCalendarResponse {
  upcoming: SquarespaceEvent[];
  past: SquarespaceEvent[];
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").trim();
}

const NI_KEYWORDS = [
  "northern ireland",
  "antrim",
  "belfast",
  "lisburn",
  "newry",
  "derry",
  "londonderry",
  "jordanstown",
  "dsni",
  "disability sport ni",
];

/**
 * Categorise and filter Boccia UK calendar events.
 *
 * - NI events: any event matching NI location keywords (all included)
 * - UK Championships: title must contain "uk championship" (excludes challengers, cups, etc.)
 * - International Championships & Paralympics: title must contain "championship",
 *   "regional championship", or "paralympic" (excludes challengers, cups, qualifiers, etc.)
 *
 * Returns null for events that should be excluded (non-championship UK/international events).
 */
function categoriseEvent(title: string, body?: string): BocciaCategory | null {
  const text = `${title} ${body ?? ""}`.toLowerCase();
  const titleLower = title.toLowerCase();

  // NI events — include all
  if (NI_KEYWORDS.some((kw) => text.includes(kw))) return "ni";

  // UK events — championships and UK challengers
  if (titleLower.includes("uk championship") || titleLower.includes("uk boccia championship")) {
    return "uk";
  }
  if (titleLower.includes("uk challenger") || titleLower.includes("uk boccia challenger")) {
    return "uk";
  }

  // International — championships, Paralympics, and World Cups
  if (titleLower.includes("paralympic")) return "international";
  if (titleLower.includes("championship")) return "international";
  if (titleLower.includes("world cup") || titleLower.includes("world boccia cup")) return "international";

  // Everything else (world challengers, qualifiers) — exclude
  return null;
}

export async function getBocciaEvents(): Promise<BocciaEvent[]> {
  try {
    const response = await fetch(
      "https://boccia.uk.com/calendar?format=json",
    );

    if (!response.ok) {
      console.error("Boccia UK API error:", response.status);
      return [];
    }

    const data: BocciaCalendarResponse = await response.json();
    const events = data.upcoming ?? [];

    return events
      .map((event) => {
        const body = event.body ? stripHtml(event.body) : undefined;
        const category = categoriseEvent(event.title, body);
        if (!category) return null;
        return {
          title: event.title,
          startDate: new Date(event.startDate),
          endDate: new Date(event.endDate),
          url: `https://boccia.uk.com/calendar/${event.urlId}`,
          location: [
            event.location?.addressTitle,
            event.location?.addressLine1,
          ]
            .filter(Boolean)
            .join(", ") || undefined,
          description: body?.slice(0, 200),
          category,
        };
      })
      .filter((e): e is BocciaEvent => e !== null);
  } catch (error) {
    console.error("Failed to fetch Boccia UK events:", error);
    return [];
  }
}
