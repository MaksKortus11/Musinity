import { useEffect, useState } from "react";
import Dither from "./Dither";

export default function AnimatedBackground() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // opóźniamy mount żeby uniknąć crashy WebGL
    const t = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(t);
  }, []);

  if (!mounted) return null;

  return (
  <div
    style={{
      position: "fixed",
      inset: 0,
      zIndex: 0,
      pointerEvents: "none",
      background: "lime", // 🔥 TEST
    }}
  >
    <Dither
      waveColor={[0.06, 0.24, 0.18]}
      waveAmplitude={0.12}
      waveFrequency={3.0}
      waveSpeed={0.015}
      colorNum={6}
      disableAnimation={false}
      enableMouseInteraction={false}
    />
  </div>
);

}


