"use client";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  /** 0 = creams stop · 1 = laser reaches · 2 = body clears */
  step: 0 | 1 | 2;
  className?: string;
}

/**
 * One unified skin cross-section that morphs between three protocol states.
 * Designed to read at a glance: the cream blob sits on top in step 0; the
 * gold laser beam descends in step 1, shattering the pigment; the fragments
 * disperse upward in step 2 leaving even tone.
 *
 * Gold (the "aurum" palette) appears ONLY here — it represents the treatment
 * energy. The rest of the brand stays in clay + cream.
 */
export function SkinJourney({ step, className }: Props) {
  return (
    <svg
      viewBox="0 0 800 540"
      className={`w-full max-w-[640px] ${className ?? ""}`}
      role="img"
      aria-label="Skin cross-section animation"
    >
      <defs>
        {/* Skin gradients */}
        <linearGradient id="sj-epidermis" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"  stopColor="#F2EBDD" />
          <stop offset="100%" stopColor="#E5DAC4" />
        </linearGradient>
        <linearGradient id="sj-dermis" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"  stopColor="#DCC3A2" />
          <stop offset="100%" stopColor="#B89274" />
        </linearGradient>
        <linearGradient id="sj-fat" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"  stopColor="#A07956" />
          <stop offset="100%" stopColor="#6B4F37" />
        </linearGradient>

        {/* Cream blob */}
        <radialGradient id="sj-cream" cx="50%" cy="50%" r="50%">
          <stop offset="0%"  stopColor="#FFFFFF" stopOpacity="1" />
          <stop offset="80%" stopColor="#F8F4EA" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#F2EBDD" stopOpacity="0.7" />
        </radialGradient>

        {/* Gold laser beam (vertical) */}
        <linearGradient id="sj-laser" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"  stopColor="#F3E2B8" stopOpacity="0" />
          <stop offset="15%" stopColor="#E6CB8F" stopOpacity="0.95" />
          <stop offset="60%" stopColor="#D4B26A" stopOpacity="1" />
          <stop offset="100%" stopColor="#A8853F" stopOpacity="0.2" />
        </linearGradient>
        {/* Gold impact glow (radial) */}
        <radialGradient id="sj-impact" cx="50%" cy="50%" r="50%">
          <stop offset="0%"  stopColor="#FFFFFF" stopOpacity="0.95" />
          <stop offset="20%" stopColor="#F3E2B8" stopOpacity="0.85" />
          <stop offset="60%" stopColor="#D4B26A" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#A8853F" stopOpacity="0" />
        </radialGradient>

        {/* Cream droplets pattern (step 0 only) */}
        <filter id="sj-soft">
          <feGaussianBlur stdDeviation="0.6" />
        </filter>
      </defs>

      {/* === Skin strata === */}
      <rect x="0" y="0"   width="800" height="80"  fill="#FAF6EE" />
      <rect x="0" y="80"  width="800" height="60"  fill="url(#sj-epidermis)" />
      <rect x="0" y="140" width="800" height="220" fill="url(#sj-dermis)" />
      <rect x="0" y="360" width="800" height="180" fill="url(#sj-fat)" />

      {/* Hairline layer dividers */}
      <line x1="0" y1="80"  x2="800" y2="80"  stroke="#B0A89E" strokeWidth="0.5" opacity="0.7" />
      <line x1="0" y1="140" x2="800" y2="140" stroke="#9A8A75" strokeWidth="0.6" opacity="0.6" />
      <line x1="0" y1="360" x2="800" y2="360" stroke="#6B4F37" strokeWidth="0.5" opacity="0.5" />

      {/* Layer labels — left side */}
      <text x="20" y="105" fill="#3A3530" fontSize="10" fontFamily="Manrope, system-ui" letterSpacing="1.5" opacity="0.7">
        EPIDERMIS
      </text>
      <text x="20" y="252" fill="#3A3530" fontSize="11" fontFamily="Manrope, system-ui" letterSpacing="1.5" fontWeight="600" opacity="0.85">
        DERMIS
      </text>
      <text x="20" y="266" fill="#3A3530" fontSize="9" fontFamily="Manrope, system-ui" letterSpacing="1.2" opacity="0.6">
        Where pigment lives
      </text>
      <text x="20" y="450" fill="#FAF6EE" fontSize="10" fontFamily="Manrope, system-ui" letterSpacing="1.5" opacity="0.7">
        SUBCUTANEOUS
      </text>

      {/* Depth scale on the right */}
      <g fontFamily="DM Mono, monospace" fontSize="9" fill="#3A3530" opacity="0.55">
        <line x1="760" y1="80"  x2="770" y2="80"  stroke="#3A3530" strokeOpacity="0.4" />
        <line x1="760" y1="140" x2="770" y2="140" stroke="#3A3530" strokeOpacity="0.4" />
        <line x1="760" y1="220" x2="770" y2="220" stroke="#3A3530" strokeOpacity="0.4" />
        <line x1="760" y1="360" x2="770" y2="360" stroke="#3A3530" strokeOpacity="0.4" />
        <text x="775" y="84" >0 mm</text>
        <text x="775" y="144">0.2</text>
        <text x="775" y="224">2.0</text>
        <text x="775" y="364">2.4 mm</text>
      </g>

      {/* === Step 0: Cream blob on the surface === */}
      <AnimatePresence>
        {step === 0 && (
          <motion.g
            key="cream"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Cream pool sitting on top */}
            <ellipse cx="400" cy="75" rx="240" ry="22" fill="url(#sj-cream)" />
            <ellipse cx="400" cy="70" rx="230" ry="16" fill="#FFFFFF" opacity="0.8" />

            {/* Diffusing droplets — diffuse into top of epidermis only */}
            {[
              [320, 90, 2], [360, 95, 1.5], [400, 92, 2], [440, 95, 1.7], [480, 90, 1.8],
              [340, 110, 1], [380, 115, 1.2], [420, 112, 1], [460, 115, 1.1],
            ].map(([x, y, r], i) => (
              <circle key={i} cx={x} cy={y} r={r} fill="#FFFFFF" opacity={0.5 - (i % 3) * 0.1} filter="url(#sj-soft)" />
            ))}

            {/* Cream label */}
            <line x1="660" y1="55" x2="555" y2="72" stroke="#3A3530" strokeOpacity="0.5" strokeWidth="0.5" />
            <text x="666" y="58" fill="#3A3530" fontSize="11" fontFamily="Manrope, system-ui" letterSpacing="0.5" fontWeight="600">
              Cream
            </text>

            {/* "Stops here" indicator */}
            <line x1="0" y1="140" x2="800" y2="140" stroke="#B85A3C" strokeWidth="1" strokeDasharray="4 3" opacity="0.85" />
            <rect x="540" y="125" width="116" height="22" rx="11" fill="#B85A3C" />
            <text x="598" y="140" fill="#FAF6EE" fontSize="11" fontFamily="Manrope, system-ui"
                  textAnchor="middle" fontWeight="600" letterSpacing="0.5">
              ← Stops here
            </text>
          </motion.g>
        )}
      </AnimatePresence>

      {/* === Step 1: Gold laser beam descending === */}
      <AnimatePresence>
        {step === 1 && (
          <motion.g key="laser">
            {/* Beam shaft */}
            <motion.rect
              x="370" y="-20" width="60" height="270"
              fill="url(#sj-laser)"
              initial={{ scaleY: 0, originY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            />
            {/* Beam centerline */}
            <motion.line
              x1="400" y1="0" x2="400" y2="250"
              stroke="#F3E2B8" strokeWidth="1.5"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            />
            {/* Impact glow at the dermal layer */}
            <motion.circle
              cx="400" cy="250" r="90"
              fill="url(#sj-impact)"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
            />
            <motion.circle
              cx="400" cy="250" r="14"
              fill="#FFFFFF"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0.8, 1, 0.85] }}
              transition={{ duration: 1.4, delay: 0.55, times: [0, 0.2, 0.5, 0.7, 1] }}
            />
            {/* Fragmenting pigment particles around impact */}
            {[
              [350, 230, 1.8], [380, 215, 1.4], [415, 220, 1.6], [445, 235, 1.5],
              [330, 260, 1.5], [365, 275, 1.3], [395, 280, 1.7], [430, 270, 1.5], [460, 265, 1.4],
              [310, 290, 1.2], [340, 305, 1.1], [395, 310, 1.3], [445, 305, 1.2], [475, 285, 1.0],
            ].map(([x, y, r], i) => (
              <motion.circle
                key={i} cx={x} cy={y} r={r} fill="#3A2418"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 0.85, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.7 + i * 0.04 }}
              />
            ))}
            {/* Gold rim halos on a few fragments — energy still present */}
            {[[365, 275], [395, 280], [430, 270]].map(([x, y], i) => (
              <motion.circle
                key={`h${i}`} cx={x} cy={y} r="4" fill="none"
                stroke="#E6CB8F" strokeWidth="0.8"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.6, 0] }}
                transition={{ duration: 1.5, delay: 0.9 + i * 0.15, repeat: Infinity, repeatDelay: 0.8 }}
              />
            ))}

            {/* Laser label */}
            <line x1="660" y1="40" x2="438" y2="80" stroke="#A8853F" strokeOpacity="0.65" strokeWidth="0.5" />
            <text x="666" y="44" fill="#A8853F" fontSize="11" fontFamily="Manrope, system-ui" letterSpacing="0.5" fontWeight="700">
              Pulsed laser
            </text>
            <text x="666" y="58" fill="#A8853F" fontSize="9" fontFamily="DM Mono, monospace" letterSpacing="1">
              750 ps
            </text>
          </motion.g>
        )}
      </AnimatePresence>

      {/* === Step 2: Pigment dispersing upward, surface evens === */}
      <AnimatePresence>
        {step === 2 && (
          <motion.g
            key="clear"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            {/* Faint residuals drifting upward */}
            {[
              [380, 230, 1.0, 0], [400, 210, 0.8, 0.1], [420, 220, 1.0, 0.2],
              [360, 200, 0.7, 0.3], [440, 195, 0.7, 0.15], [400, 180, 0.6, 0.25],
              [370, 165, 0.5, 0.35], [430, 170, 0.5, 0.4],
            ].map(([x, y, r, delay], i) => (
              <motion.circle
                key={i} cx={x} cy={y} r={r} fill="#3A2418"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 0.25, y: 0 }}
                transition={{ duration: 1.2, delay, ease: "easeOut" }}
              />
            ))}

            {/* Upward arrows showing clearance */}
            {[340, 400, 460].map((x, i) => (
              <motion.g
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 0.55, y: -10 }}
                transition={{ duration: 1.6, delay: 0.3 + i * 0.15, repeat: Infinity, repeatType: "loop", repeatDelay: 0.4 }}
              >
                <line x1={x} y1="280" x2={x} y2="180" stroke="#6B7A52" strokeWidth="1" />
                <polygon points={`${x-3},190 ${x+3},190 ${x},180`} fill="#6B7A52" />
              </motion.g>
            ))}

            {/* Subtle gold "settled" sparkle on the surface (energy result) */}
            {[
              [320, 85], [380, 88], [430, 86], [490, 89], [550, 87],
            ].map(([x, y], i) => (
              <motion.circle
                key={`s${i}`} cx={x} cy={y} r="1" fill="#E6CB8F"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.9, 0] }}
                transition={{ duration: 2, delay: i * 0.3, repeat: Infinity, repeatDelay: 1 }}
              />
            ))}

            {/* Even-tone bar at surface */}
            <motion.rect
              x="0" y="78" width="800" height="3"
              fill="#6B7A52"
              initial={{ scaleX: 0, originX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              opacity="0.45"
            />

            {/* Label */}
            <line x1="660" y1="55" x2="500" y2="78" stroke="#4A5638" strokeOpacity="0.65" strokeWidth="0.5" />
            <text x="666" y="58" fill="#4A5638" fontSize="11" fontFamily="Manrope, system-ui" letterSpacing="0.5" fontWeight="700">
              Even tone
            </text>
          </motion.g>
        )}
      </AnimatePresence>

      {/* Default (background) pigment cluster — shown in step 0 only,
          fragmented in step 1, gone in step 2 */}
      {step === 0 && (
        <g>
          {[
            [320, 220, 5], [355, 215, 4], [390, 225, 6], [425, 218, 5], [460, 222, 4],
            [340, 250, 5], [385, 245, 5], [425, 252, 4], [465, 245, 5],
            [310, 285, 4], [365, 290, 5], [410, 295, 6], [445, 288, 4], [490, 282, 4],
          ].map(([x, y, r], i) => (
            <circle key={i} cx={x} cy={y} r={r} fill="#3A2418" opacity="0.92" />
          ))}
        </g>
      )}
    </svg>
  );
}
