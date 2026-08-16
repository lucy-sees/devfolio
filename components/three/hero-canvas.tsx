// components/three/hero-canvas.tsx
"use client";

import { useEffect, useRef } from "react";
import { HeroScene } from "@/lib/three/hero-scene";

/**
 * Mounts a vanilla three.js scene onto a <canvas>. Deliberately avoids
 * react-three-fiber: R3F reconciles into the DOM via its own React
 * renderer, which has repeatedly broken under React 19 / newer Next.js
 * due to duplicate React instances. Managing the WebGL scene imperatively
 * inside a single useEffect sidesteps that entirely.
 */
export default function HeroCanvas({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const scene = new HeroScene(canvas);
    return () => scene.dispose();
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={className}
      style={{ display: "block", width: "100%", height: "100%" }}
    />
  );
}
