export type ArtistItem = {
  id: string;
  name: string;
  country?: string;
  disambiguation?: string;
};

export async function searchArtists(
  query: string
): Promise<ArtistItem[]> {
  if (!query.trim()) return [];

  try {
    const url =
      "https://musicbrainz.org/ws/2/artist?" +
      `query=${encodeURIComponent(query)}` +
      "&fmt=json&limit=10";

    const res = await fetch(url, {
      headers: {
        "User-Agent": "MusinityApp/1.0 ( demo@example.com )",
      },
    });

    const data = await res.json();

    const artists = data?.artists || [];

    return artists.map((a: any) => ({
      id: a.id,
      name: a.name,
      country: a.country,
      disambiguation: a.disambiguation,
    }));
  } catch (err) {
    console.error("MB search error", err);
    return [];
  }
}
