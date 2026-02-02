import { Routes, Route, useLocation } from "react-router-dom";
import AnimatedBackground from "./background/AnimatedBackground";
import LandingLayout from "./layout/LandingLayout";
import AppLayout from "./layout/AppLayout";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Chat from "./pages/Chat";
import Events from "./pages/Events";

export default function App() {
  const { pathname } = useLocation();
  const showBg = pathname === "/" || pathname === "/login";

  return (
    <>
      {showBg && <AnimatedBackground />}

      <Routes>
        <Route element={<LandingLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        <Route element={<AppLayout />}>
          <Route path="/chat" element={<Chat />} />
          <Route path="/events" element={<Events />} />
        </Route>
      </Routes>
    </>
  );
}

