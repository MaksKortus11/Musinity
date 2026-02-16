import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="landing">
      <div className="hero">
        <h1 className="logo">Musinity</h1>
        <p className="tagline">Your music community</p>

        <div className="actions">
  <a href="/login" className="btn btn-glass">
    Zaloguj się
  </a>
  <a href="/register" className="btn btn-glass btn-glass-accent">
    Załóż konto
  </a>
</div>

      </div>
    </div>
  );
}

