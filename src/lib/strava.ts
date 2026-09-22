interface StravaTokenResponse {
  access_token: string;
  refresh_token: string;
  expires_at: number;
}

const DEV_CACHE_TTL = 5 * 60 * 1000; // 5 minutes

let _tokenCache: { token: string; expiresAt: number } | null = null;
let _clubInfoCache: { data: ClubInfo; fetchedAt: number } | null = null;

async function getAccessToken(): Promise<string | null> {
  const clientId = import.meta.env.STRAVA_CLIENT_ID;
  const clientSecret = import.meta.env.STRAVA_CLIENT_SECRET;
  const refreshToken = import.meta.env.STRAVA_REFRESH_TOKEN;

  if (!clientId || !clientSecret || !refreshToken) {
    return null;
  }

  if (_tokenCache && Date.now() < _tokenCache.expiresAt) {
    return _tokenCache.token;
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
    _tokenCache = { token: data.access_token, expiresAt: Date.now() + DEV_CACHE_TTL };
    return data.access_token;
  } catch (error) {
    console.error("Failed to refresh Strava token:", error);
    return null;
  }
}

export interface ClubInfo {
  memberCount: number;
}

// Strava removed the Club Activities/Members/Admins endpoints on 2026-09-01
// (see https://developers.strava.com/docs/changelog/). GET /clubs/{id} is
// the only club-level data still available.
export async function getClubInfo(): Promise<ClubInfo | null> {
  const clubId = import.meta.env.STRAVA_CLUB_ID;
  if (!clubId) return null;

  if (_clubInfoCache && Date.now() - _clubInfoCache.fetchedAt < DEV_CACHE_TTL) {
    return _clubInfoCache.data;
  }

  const accessToken = await getAccessToken();
  if (!accessToken) return null;

  try {
    const response = await fetch(
      `https://www.strava.com/api/v3/clubs/${clubId}`,
      { headers: { Authorization: `Bearer ${accessToken}` } },
    );

    if (!response.ok) {
      console.error("Strava API error:", response.status);
      return null;
    }

    const data = await response.json();
    const clubInfo: ClubInfo = { memberCount: data.member_count };
    _clubInfoCache = { data: clubInfo, fetchedAt: Date.now() };
    return clubInfo;
  } catch (error) {
    console.error("Failed to fetch Strava club info:", error);
    return null;
  }
}
