interface StravaTokenResponse {
  access_token: string;
  refresh_token: string;
  expires_at: number;
}

export interface StravaActivity {
  id: number;
  name: string;
  distance: number;
  moving_time: number;
  type: string;
  total_elevation_gain?: number;
  athlete: {
    id: number;
    firstname: string;
    lastname: string;
  };
}

async function getAccessToken(): Promise<string | null> {
  const clientId = import.meta.env.STRAVA_CLIENT_ID;
  const clientSecret = import.meta.env.STRAVA_CLIENT_SECRET;
  const refreshToken = import.meta.env.STRAVA_REFRESH_TOKEN;

  if (!clientId || !clientSecret || !refreshToken) {
    return null;
  }

  try {
    const response = await fetch("https://www.strava.com/oauth/token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        refresh_token: refreshToken,
        grant_type: "refresh_token",
      }),
    });

    if (!response.ok) {
      console.error("Strava token refresh error:", response.status);
      return null;
    }

    const data: StravaTokenResponse = await response.json();
    return data.access_token;
  } catch (error) {
    console.error("Failed to refresh Strava token:", error);
    return null;
  }
}

export async function getClubActivities(
  limit = 10,
): Promise<StravaActivity[]> {
  const clubId = import.meta.env.STRAVA_CLUB_ID;
  if (!clubId) return [];

  const accessToken = await getAccessToken();
  if (!accessToken) return [];

  try {
    const response = await fetch(
      `https://www.strava.com/api/v3/clubs/${clubId}/activities?per_page=${limit}`,
      { headers: { Authorization: `Bearer ${accessToken}` } },
    );

    if (!response.ok) {
      console.error("Strava API error:", response.status);
      return [];
    }

    return await response.json();
  } catch (error) {
    console.error("Failed to fetch Strava activities:", error);
    return [];
  }
}

export interface ClubStats {
  totalActivities: number;
  totalDistance: number; // meters
  totalDuration: number; // seconds
  rideCount: number;
}

export interface LeaderboardEntry {
  name: string;
  athleteId: number;
  totalDistance: number; // meters
  totalDuration: number; // seconds
  activityCount: number;
}

export function aggregateClubStats(activities: StravaActivity[]): ClubStats {
  return activities.reduce(
    (stats, activity) => ({
      totalActivities: stats.totalActivities + 1,
      totalDistance: stats.totalDistance + activity.distance,
      totalDuration: stats.totalDuration + activity.moving_time,
      rideCount:
        stats.rideCount + (activity.type === "Ride" ? 1 : 0),
    }),
    { totalActivities: 0, totalDistance: 0, totalDuration: 0, rideCount: 0 },
  );
}

export function buildLeaderboard(
  activities: StravaActivity[],
  limit = 5,
): LeaderboardEntry[] {
  const byAthlete = new Map<string, LeaderboardEntry>();

  for (const activity of activities) {
    // Use athlete ID if available, otherwise use name as key
    const athleteId = activity.athlete.id;
    const name = `${activity.athlete.firstname} ${activity.athlete.lastname.charAt(0)}.`;
    const key = athleteId ? String(athleteId) : name;

    const existing = byAthlete.get(key);
    if (existing) {
      existing.totalDistance += activity.distance;
      existing.totalDuration += activity.moving_time;
      existing.activityCount += 1;
    } else {
      byAthlete.set(key, {
        name,
        athleteId: athleteId || 0,
        totalDistance: activity.distance,
        totalDuration: activity.moving_time,
        activityCount: 1,
      });
    }
  }

  return [...byAthlete.values()]
    .sort((a, b) => b.totalDistance - a.totalDistance)
    .slice(0, limit);
}

export function metersToMiles(meters: number): number {
  return meters / 1609.344;
}

export function formatDistance(meters: number): string {
  return metersToMiles(meters).toFixed(1) + " miles";
}

export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
}
