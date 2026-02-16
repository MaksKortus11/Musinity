import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="landing">
      <div className="hero">
        <h1 className="logo">Musinity</h1>
        <p className="tagline">Your music community</p>

<div className="actions">
  <Link to="/login" className="btn btn-glass">
    Zaloguj się
  </Link>
  <Link to="/register" className="btn btn-glass">
    Załóż konto
  </Link>
</div>

      </div>
    </div>
  );
}

