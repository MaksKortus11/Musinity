import { Outlet, NavLink } from "react-router-dom";

export default function AppLayout() {
  return (
    <div className="app">
      <aside className="sidebar">
        <h1>Musinity</h1>
        <nav>
          <NavLink to="/chat">Chat</NavLink>
          <NavLink to="/events">Eventy</NavLink>
        </nav>
      </aside>

      <main className="main">
        <Outlet />
      </main>
    </div>
  );
}

