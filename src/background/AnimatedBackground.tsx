import Dither from "./Dither";

export default function AnimatedBackground() {
  return (
    <div className="bg-layer">
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

