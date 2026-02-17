import ArtistSearch from "../components/music/ArtistSearch";
import { ArtistItem } from "../lib/musicbrainz";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { registerUser } from "../lib/auth";
import { GENRES } from "../lib/genres";

export default function Register() {
  const nav = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  


  // accordion + selection
  const [openMain, setOpenMain] = useState<string | null>(null);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [favArtists, setFavArtists] = useState<ArtistItem[]>([]);

  // ===== handlers =====

  function toggleMain(main: string) {
    setOpenMain(prev => (prev === main ? null : main));
  }

  function toggleGenre(sub: string) {
    setSelectedGenres(prev =>
      prev.includes(sub)
        ? prev.filter(g => g !== sub)
        : [...prev, sub]
    );
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // 🔥 wyliczamy MAIN na podstawie SUB
    const mainGenres = Object.entries(GENRES)
      .filter(([_, subs]) =>
        subs.some(s => selectedGenres.includes(s))
      )
      .map(([main]) => main);

    const res = registerUser({
      username,
      password,
      genres: selectedGenres,
      mainGenres,
      favoriteArtists: favArtists,
    });

    if (!res.ok) {
      setError(res.message || "Błąd");
      return;
    }

    nav("/chat");
  }

  return (
    <div className="landing">
      <div className="auth-card">
        <h2 className="auth-title">Załóż konto</h2>

        <form className="auth-form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Nazwa użytkownika"
            className="auth-input"
            value={username}
            onChange={e => setUsername(e.target.value)}
          />

          <input
            type="password"
            placeholder="Hasło"
            className="auth-input"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />

          {/* ===== GENRE ACCORDION ===== */}

          <div className="genre-accordion">
            {Object.entries(GENRES).map(([main, subs]) => (
              <div key={main} className="genre-group">
                <button
                  type="button"
                  className="genre-main"
                  onClick={() => toggleMain(main)}
                >
                  {main}
                </button>

                {openMain === main && (
                  <div className="genre-subs">
                    {subs.map(sub => (
                      <button
                        type="button"
                        key={sub}
                        onClick={() => toggleGenre(sub)}
                        className={
                          selectedGenres.includes(sub)
                            ? "genre-chip active"
                            : "genre-chip"
                        }
                      >
                        {sub}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div style={{ marginTop: "1rem" }}>
  <h3 style={{ color: "white", marginBottom: "0.4rem" }}>
    Ulubieni artyści
  </h3>

  <ArtistSearch
    selected={favArtists}
    onChange={setFavArtists}
  />
</div>


          {error && <div className="auth-error">{error}</div>}

          <button type="submit" className="btn btn-glass auth-submit">
            Utwórz konto
          </button>
        </form>

        <p className="auth-switch">
          Masz już konto? <Link to="/login">Zaloguj się</Link>
        </p>
      </div>
    </div>
  );
}
