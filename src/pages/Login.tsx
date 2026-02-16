import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { loginUser } from "../lib/auth";

export default function Login() {
  const nav = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const res = loginUser(username, password);

    if (!res.ok) {
      setError(res.message || "Błąd");
      return;
    }

    nav("/chat");
  }

  return (
    <div className="landing">
      <div className="auth-card">
        <h2 className="auth-title">Zaloguj się</h2>

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

          {error && <div className="auth-error">{error}</div>}

          <button type="submit" className="btn btn-glass auth-submit">
            Zaloguj się
          </button>
        </form>

        <p className="auth-switch">
          Nie masz konta? <Link to="/register">Załóż konto</Link>
        </p>
      </div>
    </div>
  );
}
