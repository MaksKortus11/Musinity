import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="center">
      <h2>Musinity</h2>
      <p>Your music community</p>

      <div className="actions">
        <Link to="/login">Zaloguj się</Link>
        <Link to="/register">Załóż konto</Link>
      </div>
    </div>
  );
}

