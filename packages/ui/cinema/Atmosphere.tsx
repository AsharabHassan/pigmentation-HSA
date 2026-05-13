"use client";
import { motion, useReducedMotion } from "framer-motion";

/**
 * Cinematic atmosphere — animated grain + drifting gold light beams.
 * Sits absolutely-positioned inside a section as a background layer.
 */
export function Atmosphere({
  variant = "ambient",
  intensity = 1,
}: {
  variant?: "ambient" | "spotlight-top" | "spotlight-corner" | "halo";
  intensity?: number;
}) {
  const reduced = useReducedMotion();

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Drifting gold light */}
      {variant === "ambient" && (
        <motion.div
          className="absolute -top-1/4 -left-1/4 w-[150%] h-[150%] rounded-full"
          style={{
            background: `radial-gradient(ellipse at center, rgba(201,166,92,${0.10 * intensity}) 0%, rgba(201,166,92,0) 55%)`,
          }}
          animate={reduced ? undefined : { x: ["-5%", "5%", "-5%"], y: ["0%", "-3%", "0%"] }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
        />
      )}

      {variant === "spotlight-top" && (
        <div
          className="absolute inset-x-0 top-0 h-[60vh]"
          style={{
            background: `radial-gradient(ellipse 80% 60% at 50% 0%, rgba(201,166,92,${0.18 * intensity}) 0%, rgba(201,166,92,0) 70%)`,
          }}
        />
      )}

      {variant === "spotlight-corner" && (
        <>
          <motion.div
            className="absolute -top-32 -right-32 w-[80vw] h-[80vw] max-w-[700px] max-h-[700px] rounded-full"
            style={{
              background: `radial-gradient(circle, rgba(201,166,92,${0.16 * intensity}) 0%, rgba(201,166,92,0) 60%)`,
            }}
            animate={reduced ? undefined : { opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          <div
            className="absolute -bottom-40 -left-40 w-[60vw] h-[60vw] max-w-[600px] max-h-[600px] rounded-full"
            style={{
              background: `radial-gradient(circle, rgba(140,107,52,${0.10 * intensity}) 0%, rgba(140,107,52,0) 70%)`,
            }}
          />
        </>
      )}

      {variant === "halo" && (
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] max-w-[900px] max-h-[900px] rounded-full"
          style={{
            background: `radial-gradient(circle, rgba(201,166,92,${0.18 * intensity}) 0%, rgba(201,166,92,0) 55%)`,
          }}
          animate={reduced ? undefined : { scale: [1, 1.05, 1], opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
      )}

      {/* Film grain layer */}
      <div
        className="absolute inset-0 opacity-[0.08] mix-blend-overlay"
        style={{
          backgroundImage:
            `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 300 300'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.79  0 0 0 0 0.65  0 0 0 0 0.36  0 0 0 0.7 0'/></filter><rect width='300' height='300' filter='url(%23n)'/></svg>")`,
          backgroundSize: "300px 300px",
        }}
      />

      {/* Soft vignette */}
      <div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.55) 100%)",
        }}
      />
    </div>
  );
}
