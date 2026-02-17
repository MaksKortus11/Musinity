import { useEffect, useState } from "react";
import { searchArtists, ArtistItem } from "../../lib/musicbrainz";

type Props = {
  selected: ArtistItem[];
  onChange: (artists: ArtistItem[]) => void;
};

export default function ArtistSearch({ selected, onChange }: Props) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ArtistItem[]>([]);
  const [loading, setLoading] = useState(false);

  // 🔎 search debounce
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const t = setTimeout(() => {
      setLoading(true);
      searchArtists(query)
        .then(setResults)
        .finally(() => setLoading(false));
    }, 400);

    return () => clearTimeout(t);
  }, [query]);

  function toggleArtist(a: ArtistItem) {
    const exists = selected.some(x => x.id === a.id);

    if (exists) {
      onChange(selected.filter(x => x.id !== a.id));
    } else {
      onChange([...selected, a]);
    }
  }

  return (
    <div className="artist-search">
      <input
        className="artist-input"
        placeholder="Szukaj artysty..."
        value={query}
        onChange={e => setQuery(e.target.value)}
      />

      {loading && (
        <div className="artist-empty">Szukam…</div>
      )}

      <div className="artist-results">
        {results.map(a => {
          const active = selected.some(x => x.id === a.id);

          return (
            <button
  type="button"
  key={a.id}
  onClick={() => toggleArtist(a)}
  className={active ? "artist-item active" : "artist-item"}
>

              <div className="artist-name">{a.name}</div>

              {(a.country || a.disambiguation) && (
                <div className="artist-meta">
                  {a.country}
                  {a.country && a.disambiguation && " • "}
                  {a.disambiguation}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

