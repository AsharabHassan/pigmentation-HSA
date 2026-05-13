"use client";
import Image from "next/image";
import { useCallback, useRef, useState, useEffect } from "react";

export interface BeforeAfterSliderProps {
  beforeSrc: string;
  afterSrc: string;
  beforeAlt: string;
  afterAlt: string;
  initialPercent?: number;
  beforeLabel?: string;   // e.g. "Day 0"
  afterLabel?: string;    // e.g. "Week 12"
  className?: string;
}

/**
 * Couture Reveal — the BA slider, rethought as a precision instrument.
 * - No round handle. A vertical hairline of brushed gold marks the index.
 * - A liquid-gold caustic glows along the divider, lit only when dragging.
 * - Roman numeral ticks (I-X) sit beneath, etched into the frame.
 * - Side labels swap from BEFORE -> AFTER in small caps as the index passes 50.
 */
export function BeforeAfterSlider({
  beforeSrc, afterSrc, beforeAlt, afterAlt,
  initialPercent = 50,
  beforeLabel = "Before",
  afterLabel = "After",
  className,
}: BeforeAfterSliderProps) {
  const [percent, setPercent] = useState(initialPercent);
  const [dragging, setDragging] = useState(false);
  const [hasMoved, setHasMoved] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const updateFromClientX = useCallback((clientX: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const next = ((clientX - rect.left) / rect.width) * 100;
    setPercent(Math.max(0, Math.min(100, next)));
    setHasMoved(true);
  }, []);

  const onPointerDown = (e: React.PointerEvent) => {
    (e.target as Element).setPointerCapture?.(e.pointerId);
    setDragging(true);
    updateFromClientX(e.clientX);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging) return;
    updateFromClientX(e.clientX);
  };
  const onPointerUp = () => setDragging(false);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") { setPercent(p => Math.min(100, p + 5)); setHasMoved(true); }
    if (e.key === "ArrowLeft") { setPercent(p => Math.max(0, p - 5)); setHasMoved(true); }
    if (e.key === "Home") { setPercent(0); setHasMoved(true); }
    if (e.key === "End") { setPercent(100); setHasMoved(true); }
  };

  // Subtle first-load reveal — moves index a few percent so user sees it's interactive
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setTimeout(() => {
      if (!hasMoved) {
        setPercent(56);
        setTimeout(() => !hasMoved && setPercent(50), 700);
      }
    }, 1400);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const rounded = Math.round(percent);
  const isAfter = rounded >= 50;

  return (
    <figure className={`relative w-full ${className ?? ""}`}>
      {/* Engraved frame */}
      <div className="relative w-full aspect-[4/5] overflow-hidden ring-1 ring-gold-500/40 bg-surface-charcoal">
        <div
          ref={containerRef}
          className="absolute inset-0 select-none touch-none"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        >
          {/* AFTER (underneath) */}
          <Image
            src={afterSrc} alt={afterAlt} fill priority
            sizes="(max-width: 768px) 100vw, 60vw"
            className="object-cover"
          />

          {/* BEFORE (clipped from right) */}
          <div
            className="absolute inset-0 overflow-hidden"
            style={{ clipPath: `inset(0 ${100 - percent}% 0 0)` }}
          >
            <Image
              src={beforeSrc} alt={beforeAlt} fill priority
              sizes="(max-width: 768px) 100vw, 60vw"
              className="object-cover"
            />
          </div>

          {/* Vignette */}
          <div aria-hidden className="absolute inset-0 pointer-events-none
                                       bg-[radial-gradient(ellipse_at_center,transparent_55%,rgba(0,0,0,0.55)_100%)]" />

          {/* Gold caustic divider — brightens when dragging */}
          <div
            aria-hidden
            className="absolute top-0 bottom-0 pointer-events-none"
            style={{ left: `${percent}%`, transform: "translateX(-50%)" }}
          >
            {/* glow */}
            <div
              className="absolute top-0 bottom-0 w-[18px] -left-[8px] transition-opacity duration-500"
              style={{
                opacity: dragging ? 1 : 0.55,
                background: "radial-gradient(ellipse at center, rgba(201,166,92,0.55) 0%, rgba(201,166,92,0) 70%)",
              }}
            />
            {/* hairline */}
            <div className="absolute top-0 bottom-0 w-px left-0 bg-gold-500" />
            {/* index serif marks (top & bottom) */}
            <div className="absolute -top-1 -left-2 w-5 h-px bg-gold-500" />
            <div className="absolute -bottom-1 -left-2 w-5 h-px bg-gold-500" />
          </div>

          {/* The slider — invisible full-width range over the image */}
          <button
            type="button"
            role="slider"
            aria-label="Drag to reveal the after image"
            aria-valuemin={0} aria-valuemax={100} aria-valuenow={rounded}
            tabIndex={0}
            onKeyDown={onKeyDown}
            className="absolute inset-0 w-full h-full cursor-ew-resize bg-transparent
                       focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500/70"
          />

          {/* Engraved corner labels (Latin caps, mono index) */}
          <div className="absolute top-5 left-5 z-10 pointer-events-none">
            <div className="text-[10px] tracking-[0.32em] font-mono text-gold-400/85 uppercase">
              {beforeLabel}
            </div>
          </div>
          <div className="absolute top-5 right-5 z-10 text-right pointer-events-none">
            <div className="text-[10px] tracking-[0.32em] font-mono text-gold-400/85 uppercase">
              {afterLabel}
            </div>
          </div>

          {/* Index readout (bottom-center) */}
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-10 pointer-events-none
                          flex items-center gap-2 text-[10px] font-mono tracking-[0.28em] uppercase text-gold-400/85">
            <span>{isAfter ? afterLabel : beforeLabel}</span>
            <span className="w-6 h-px bg-gold-400/40" />
            <span>{rounded.toString().padStart(2, "0")}%</span>
          </div>
        </div>
      </div>

      {/* Roman numeral baseline ticks */}
      <div aria-hidden className="mt-3 grid grid-cols-11 items-center select-none">
        {["", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", ""].map((n, i) => (
          <div key={i} className="flex flex-col items-center gap-1.5">
            <span className={`h-2 w-px ${i === 5 ? "bg-gold-500" : "bg-gold-500/30"}`} />
            <span className={`text-[10px] font-mono tracking-widest ${i === 5 ? "text-gold-500" : "text-gold-500/40"}`}>
              {n}
            </span>
          </div>
        ))}
      </div>

      {/* Hint (only before first interaction) */}
      {!hasMoved && (
        <figcaption className="absolute -bottom-7 left-1/2 -translate-x-1/2 text-[10px] uppercase tracking-[0.32em] text-gold-500/50 font-mono">
          ◂ Drag to reveal ▸
        </figcaption>
      )}
    </figure>
  );
}
