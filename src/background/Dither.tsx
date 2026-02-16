import "./Dither.css";
import { Canvas } from "@react-three/fiber";
import { EffectComposer, wrapEffect } from "@react-three/postprocessing";
import { Effect } from "postprocessing";
import * as THREE from "three";

/* =========================
   MUSINITY DITHER — TRUE HALFTONE
========================= */

const fragmentShader = /* glsl */ `
uniform float time;

/* ===== random ===== */

float random(vec2 p){
  return fract(sin(dot(p, vec2(127.1,311.7))) * 43758.5453);
}

/* ===== noise ===== */

float noise(vec2 p){
  vec2 i = floor(p);
  vec2 f = fract(p);

  float a = random(i);
  float b = random(i + vec2(1.0,0.0));
  float c = random(i + vec2(0.0,1.0));
  float d = random(i + vec2(1.0,1.0));

  vec2 u = f*f*(3.0-2.0*f);

  return mix(a,b,u.x) +
         (c-a)*u.y*(1.0-u.x) +
         (d-b)*u.x*u.y;
}

/* ===== fbm ===== */

float fbm(vec2 p){
  float v = 0.0;
  float a = 0.5;

  for(int i=0;i<5;i++){
    v += a * noise(p);
    p *= 2.0;
    a *= 0.5;
  }

  return v;
}

/* ===== main ===== */

void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {

  vec2 p = uv;

  // 🔥 diagonal drift (zostaje)
  p += vec2(-time * 0.04, time * 0.04);

  /* ===== cloud field ===== */
  float field = fbm(p * 4.0);

  float cloud = smoothstep(0.45, 0.75, field);

  /* ===== HALFTONE GRID ===== */
  float grid = 260.0; // 🔥 MNIEJSZE = większe kropki

  vec2 cell = fract(uv * grid) - 0.5;
  float dist = length(cell);

  /* ===== dynamic radius (KLUCZ ReactBits) ===== */
  float radius = cloud * 0.55;

  /* ===== soft edge — robi "gwiazdy" ===== */
  float dot = smoothstep(radius, radius - 0.12, dist);

  /* ===== binary colors ===== */
  vec3 black = vec3(0.0, 0.0, 0.0);
  vec3 green = vec3(0.108, 0.765, 0.315);

  vec3 finalColor = mix(black, green, dot);

  outputColor = vec4(finalColor, 1.0);
}
`;

class WaveEffectImpl extends Effect {
  constructor() {
    super("WaveEffect", fragmentShader, {
      uniforms: new Map([
        ["time", new THREE.Uniform(0)],
      ]),
    });
  }

  update(renderer: any, inputBuffer: any, deltaTime: number) {
    this.uniforms.get("time")!.value += deltaTime;
  }
}

const WaveEffect = wrapEffect(WaveEffectImpl);

function Scene() {
  return (
    <EffectComposer>
      <WaveEffect />
    </EffectComposer>
  );
}

export default function Dither() {
  return (
    <Canvas
      className="dither-container"
      orthographic
      camera={{ position: [0, 0, 1] }}
      dpr={1}
      gl={{ antialias: true }}
    >
      <Scene />
    </Canvas>
  );
}
