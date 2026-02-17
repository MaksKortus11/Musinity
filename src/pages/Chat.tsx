import { useEffect, useRef, useState } from "react";
import { getCurrentUserData, MOCK_MESSAGES } from "../lib/chat";
import { fetchArtistEvents } from "../lib/events";

const STORAGE_KEY = "musinity_messages";
const ROOM_KEY = "musinity_active_room";

export default function Chat() {
  const user = getCurrentUserData();

  // ===== ROOMS =====
  const genreRooms = user?.mainGenres || [];
  const artistRooms =
    user?.favoriteArtists?.map(a => `ARTIST:${a.name}`) || [];

  const rooms = [...genreRooms, ...artistRooms];

  // ===== ACTIVE ROOM (persistent) =====
  const [activeRoom, setActiveRoom] = useState<string | null>(() => {
    const saved = localStorage.getItem(ROOM_KEY);
    if (saved) return saved;
    return rooms[0] || null;
  });

  const [input, setInput] = useState("");

  // ===== LOAD + MERGE MESSAGES =====
  const [messagesByRoom, setMessagesByRoom] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return { ...MOCK_MESSAGES, ...parsed };
      }
    } catch {}

    return { ...MOCK_MESSAGES };
  });

  const messages =
    (activeRoom && messagesByRoom[activeRoom]) || [];

  // ===== DETECT ARTIST ROOM =====
  const isArtistRoom = activeRoom?.startsWith("ARTIST:");
  const artistName = isArtistRoom
    ? activeRoom.replace("ARTIST:", "")
    : null;

  // ===== ARTIST EVENTS STATE =====
  const [artistEvents, setArtistEvents] = useState<any[]>([]);
  const [loadingArtistEvents, setLoadingArtistEvents] =
    useState(false);

  // ===== FETCH ARTIST EVENTS =====
  useEffect(() => {
    if (!artistName) return;

    setLoadingArtistEvents(true);

    fetchArtistEvents(artistName)
      .then(setArtistEvents)
      .finally(() => setLoadingArtistEvents(false));
  }, [artistName]);

  // ===== SAVE MESSAGES =====
  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(messagesByRoom)
    );
  }, [messagesByRoom]);

  // ===== SAVE ACTIVE ROOM =====
  useEffect(() => {
    if (activeRoom) {
      localStorage.setItem(ROOM_KEY, activeRoom);
    }
  }, [activeRoom]);

  // ===== AUTO SCROLL =====
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, activeRoom]);

  // ===== SEND =====
  function handleSend() {
    if (!activeRoom || !input.trim() || !user) return;

    setMessagesByRoom(prev => ({
      ...prev,
      [activeRoom]: [
        ...(prev[activeRoom] || []),
        {
          user: user.username,
          text: input.trim(),
        },
      ],
    }));

    setInput("");
  }

  function handleKeyDown(
    e: React.KeyboardEvent<HTMLInputElement>
  ) {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <div className="chat-layout">
      {/* ===== SIDEBAR ===== */}
      <aside className="chat-rooms">
        {/* GENRES */}
        <h3 className="chat-rooms-title">Twoje gatunki</h3>

        {genreRooms.map(room => (
          <button
            key={room}
            onClick={() => setActiveRoom(room)}
            className={
              room === activeRoom
                ? "chat-room active"
                : "chat-room"
            }
          >
            {room}
          </button>
        ))}

        {/* ARTISTS */}
        {artistRooms.length > 0 && (
          <>
            <h3
              className="chat-rooms-title"
              style={{ marginTop: "1rem" }}
            >
              Twoi artyści
            </h3>

            {artistRooms.map(room => {
              const name = room.replace("ARTIST:", "");

              return (
                <button
                  key={room}
                  onClick={() => setActiveRoom(room)}
                  className={
                    room === activeRoom
                      ? "chat-room active"
                      : "chat-room"
                  }
                >
                  🎧 {name}
                </button>
              );
            })}
          </>
        )}
      </aside>

      {/* ===== CHAT ===== */}
      <main className="chat-main">
        {!activeRoom && (
          <div className="chat-empty-main">
            Wybierz pokój 👈
          </div>
        )}

        {activeRoom && (
          <>
            <div className="chat-header">
              {artistName || activeRoom}
            </div>

            {/* ===== EVENTY ARTYSTY ===== */}
            {artistName && (
              <div className="artist-events-strip">
                {loadingArtistEvents && (
                  <div className="artist-events-empty">
                    Szukam koncertów…
                  </div>
                )}

                {!loadingArtistEvents &&
                  artistEvents.slice(0, 5).map(ev => (
                    <a
                      key={ev.id}
                      href={ev.url}
                      target="_blank"
                      rel="noreferrer"
                      className="artist-event-pill"
                    >
                      {ev.city} • {ev.date}
                    </a>
                  ))}
              </div>
            )}

            <div className="chat-messages">
              {messages.map((m, i) => {
                const isMe = m.user === user?.username;

                return (
                  <div
                    key={i}
                    className={isMe ? "chat-row me" : "chat-row"}
                  >
                    <div className="chat-bubble">
                      {!isMe && (
                        <div className="chat-bubble-user">
                          {m.user}
                        </div>
                      )}

                      <div className="chat-bubble-text">
                        {m.text}
                      </div>
                    </div>
                  </div>
                );
              })}

              <div ref={bottomRef} />
            </div>

            <div className="chat-input">
              <input
                placeholder="Napisz wiadomość..."
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
              />
            </div>
          </>
        )}
      </main>
    </div>
  );
}
