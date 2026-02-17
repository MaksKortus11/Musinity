function getNowISO() {
  return new Date().toISOString().split(".")[0] + "Z";
}

import { getCurrentUserData } from "./chat";

const API_KEY = import.meta.env.VITE_TM_KEY;
const BASE =
  "https://app.ticketmaster.com/discovery/v2/events.json";

export type EventItem = {
  id: string;
  name: string;
  date?: string;
  city?: string;
  country?: string;
  url?: string;
  image?: string;
};


// 🔥 helper — buduje keyword z wielu gatunków
function buildKeyword(genres: string[]) {
  if (!genres.length) return "music";

  // 🎯 priorytet pierwszego gatunku
  const primary = genres[0];

  // 🧠 lekkie mapowanie pod Ticketmaster
  const map: Record<string, string> = {
    "R&B": "R&B",
    HipHop: "hip hop",
    Jazz: "jazz",
    Latin: "latin",
    Country: "country",
    Pop: "pop",
    Rock: "rock",
  };

  return map[primary] || primary;
}


async function fetchFromTM(
  keyword: string,
  countryCode: string
): Promise<EventItem[]> {
  const now = getNowISO();

const url =
  `${BASE}?apikey=${API_KEY}` +
  `&keyword=${encodeURIComponent(keyword)}` +
  `&countryCode=${countryCode}` +
  `&startDateTime=${now}` +
  `&size=24&sort=date,asc`;


  const res = await fetch(url);
  const data = await res.json();

  const events = data?._embedded?.events || [];

  return events.map((e: any) => ({
  id: e.id,
  name: e.name,
  date: e.dates?.start?.localDate,
  city: e._embedded?.venues?.[0]?.city?.name,
  country: e._embedded?.venues?.[0]?.country?.countryCode,
  url: e.url,
  image:
    e.images?.find((img: any) => img.ratio === "16_9")
      ?.url || e.images?.[0]?.url,
}));

}

export async function fetchEvents(): Promise<EventItem[]> {
  try {
    const user = getCurrentUserData();
    const genres = user?.mainGenres || [];

    const keyword = buildKeyword(genres);

    // 🥇 1. Polska + gatunki
    let events = await fetchFromTM(keyword, "PL");

    // 🥈 2. fallback Polska + music
    if (events.length === 0) {
      events = await fetchFromTM("music", "PL");
    }

    // 🥉 3. fallback Europa + gatunki
    if (events.length === 0) {
      events = await fetchFromTM(keyword, "DE");
    }

    // 🧨 4. ostateczny fallback global music
    if (events.length === 0) {
      const globalUrl =
        `${BASE}?apikey=${API_KEY}` +
        `&keyword=music&size=12&sort=date,asc`;

      const res = await fetch(globalUrl);
      const data = await res.json();

      events = (data?._embedded?.events || []).map(
        (e: any) => ({
          id: e.id,
          name: e.name,
          date: e.dates?.start?.localDate,
          city: e._embedded?.venues?.[0]?.city?.name,
          country:
            e._embedded?.venues?.[0]?.country?.countryCode,
          url: e.url,
        })
      );
    }

    // 🧹 usuń duplikaty
    const unique = Array.from(
      new Map(events.map(e => [e.id, e])).values()
    );

    return unique.slice(0, 12);
  } catch (err) {
    console.error("TM fetch error", err);
    return [];
  }
}

export async function fetchArtistEvents(
  artistName: string
): Promise<EventItem[]> {
  try {
    if (!artistName) return [];

    // 🥇 Polska first
    let events = await fetchFromTM(artistName, "PL");

    // 🥈 fallback Europa
    if (events.length === 0) {
      events = await fetchFromTM(artistName, "DE");
    }

    // 🥉 fallback global
    if (events.length === 0) {
      const url =
        `${BASE}?apikey=${API_KEY}` +
        `&keyword=${encodeURIComponent(artistName)}` +
        `&size=12&sort=date,asc`;

      const res = await fetch(url);
      const data = await res.json();

      events = (data?._embedded?.events || []).map(
        (e: any) => ({
          id: e.id,
          name: e.name,
          date: e.dates?.start?.localDate,
          city: e._embedded?.venues?.[0]?.city?.name,
          country:
            e._embedded?.venues?.[0]?.country?.countryCode,
          url: e.url,
          image:
            e.images?.find((img: any) => img.ratio === "16_9")
              ?.url || e.images?.[0]?.url,
        })
      );
    }

    return events.slice(0, 8);
  } catch (err) {
    console.error("Artist events error", err);
    return [];
  }
}


