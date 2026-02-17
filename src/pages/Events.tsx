import { useEffect, useState } from "react";
import { fetchEvents, EventItem } from "../lib/events";

export default function Events() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchEvents()
      .then(setEvents)
      .catch(() => setError("Nie udało się pobrać wydarzeń"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="events-page">
      <h2 className="events-title">Wydarzenia dla Ciebie</h2>

      {loading && (
        <div className="events-empty">Ładowanie…</div>
      )}

      {error && <div className="events-empty">{error}</div>}

      {!loading && events.length === 0 && (
  <div className="events-empty events-empty-smart">
    <div className="events-empty-title">
      🎧 Nic w Twoim stylu… jeszcze
    </div>
    <div className="events-empty-sub">
      Spróbuj dodać więcej gatunków lub artystów.
    </div>
  </div>
)}


      <div className="events-grid">
        {events.map(ev => (
          <a
  key={ev.id}
  href={ev.url}
  target="_blank"
  rel="noreferrer"
  className="event-card"
>
  <div className="event-image-wrap">
    {ev.image && (
      <img
        src={ev.image}
        alt={ev.name}
        className="event-image"
      />
    )}
    <div className="event-image-overlay" />
  </div>

  <div className="event-content">
    <div className="event-name">{ev.name}</div>

    <div className="event-meta">
  {ev.date && <span>{ev.date}</span>}
</div>

{ev.city && (
  <div className="event-city-badge">
    📍 {ev.city}
  </div>
)}

  </div>
</a>

        ))}
      </div>
    </div>
  );
}

