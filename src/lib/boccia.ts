export interface BocciaEvent {
  title: string;
  startDate: Date;
  endDate: Date;
  url: string;
  location?: string;
  description?: string;
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

    return events.map((event) => ({
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
      description: event.body ? stripHtml(event.body).slice(0, 200) : undefined,
    }));
  } catch (error) {
    console.error("Failed to fetch Boccia UK events:", error);
    return [];
  }
}
