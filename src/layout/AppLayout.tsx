import { Outlet, Link, useNavigate } from "react-router-dom";
import { getSessionUser, logoutUser } from "../lib/auth";

export default function AppLayout() {
  const nav = useNavigate();
  const user = getSessionUser();

  function handleLogout() {
    logoutUser();
    nav("/login");
  }

  return (
    <div className="app">
      <aside className="sidebar">
        <h2>Musinity</h2>

        <nav>
          <Link to="/chat">Chat</Link>
          <Link to="/events">Events</Link>
        </nav>

        {/* ===== USER SECTION (dół sidebara) ===== */}
        <div className="sidebar-user">
          <div className="sidebar-username">👤 {user}</div>

          <button onClick={handleLogout} className="btn btn-glass sidebar-logout">
            Wyloguj
          </button>
        </div>
      </aside>

      <main className="main">
        <Outlet />
      </main>
    </div>
  );
}
