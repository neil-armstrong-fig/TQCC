interface InstagramPost {
  id: string;
  caption?: string;
  media_type: "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM";
  media_url: string;
  thumbnail_url?: string;
  permalink: string;
  timestamp: string;
}

interface InstagramResponse {
  data: InstagramPost[];
}

export async function getInstagramPosts(
  limit = 12,
): Promise<InstagramPost[]> {
  const accessToken = import.meta.env.INSTAGRAM_ACCESS_TOKEN;
  const userId = import.meta.env.INSTAGRAM_USER_ID;

  if (!accessToken || !userId) {
    return [];
  }

  try {
    const fields =
      "id,caption,media_type,media_url,thumbnail_url,permalink,timestamp";
    const response = await fetch(
      `https://graph.instagram.com/v21.0/${userId}/media?fields=${fields}&limit=${limit}&access_token=${accessToken}`,
    );

    if (!response.ok) {
      console.error("Instagram API error:", response.status);
      return [];
    }

    const data: InstagramResponse = await response.json();
    return data.data;
  } catch (error) {
    console.error("Failed to fetch Instagram posts:", error);
    return [];
  }
}
