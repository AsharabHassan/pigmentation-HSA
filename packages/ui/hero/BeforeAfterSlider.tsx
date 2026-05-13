"use client";
import Image from "next/image";
import { useCallback, useRef, useState, useEffect } from "react";

export interface BeforeAfterSliderProps {
  beforeSrc: string;
  afterSrc: string;
  beforeAlt: string;
  afterAlt: string;
  initialPercent?: number;
  beforeLabel?: string;
  afterLabel?: string;
  className?: string;
}

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
    if (e.key === "ArrowLeft")  { setPercent(p => Math.max(0, p - 5));   setHasMoved(true); }
    if (e.key === "Home") { setPercent(0); setHasMoved(true); }
    if (e.key === "End")  { setPercent(100); setHasMoved(true); }
  };

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setTimeout(() => {
      if (!hasMoved) {
        setPercent(58);
        setTimeout(() => !hasMoved && setPercent(50), 700);
      }
    }, 1200);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const rounded = Math.round(percent);

  return (
    <figure className={`relative w-full ${className ?? ""}`}>
      <div
        ref={containerRef}
        className="relative w-full aspect-[4/5] overflow-hidden ring-1 ring-gold-500/30 bg-surface-charcoal select-none touch-none"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <Image
          src={afterSrc} alt={afterAlt} fill priority
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover"
        />
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ clipPath: `inset(0 ${100 - percent}% 0 0)` }}
        >
          <Image
            src={beforeSrc} alt={beforeAlt} fill priority
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />
        </div>

        <div aria-hidden className="absolute inset-x-0 bottom-0 h-24 pointer-events-none
                                     bg-gradient-to-t from-black/55 to-transparent" />

        <div
          aria-hidden
          className="absolute top-0 bottom-0 pointer-events-none"
          style={{ left: `${percent}%`, transform: "translateX(-50%)" }}
        >
          <div
            className="absolute top-0 bottom-0 w-[16px] -left-[7px] transition-opacity duration-300"
            style={{
              opacity: dragging ? 0.85 : 0.4,
              background: "radial-gradient(ellipse at center, rgba(201,166,92,0.55) 0%, rgba(201,166,92,0) 70%)",
            }}
          />
          <div className="absolute top-0 bottom-0 w-px left-0 bg-gold-500" />
        </div>

        <button
          type="button"
          role="slider"
          aria-label="Drag to reveal the after image"
          aria-valuemin={0} aria-valuemax={100} aria-valuenow={rounded}
          tabIndex={0}
          onKeyDown={onKeyDown}
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2
                     w-11 h-11 rounded-full bg-ivory-50 border-2 border-gold-500
                     shadow-[0_4px_24px_rgba(0,0,0,0.5)]
                     flex items-center justify-center text-ink-900
                     cursor-grab active:cursor-grabbing
                     focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-300"
          style={{ left: `${percent}%` }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden>
            <path d="M2 8 L5 5 L5 11 Z" fill="currentColor" />
            <path d="M14 8 L11 5 L11 11 Z" fill="currentColor" />
          </svg>
        </button>

        <span className="absolute top-4 left-4 z-10 text-[10px] tracking-[0.22em] font-mono text-ivory-50 bg-black/55 px-2 py-1 backdrop-blur-sm uppercase pointer-events-none">
          {beforeLabel}
        </span>
        <span className="absolute top-4 right-4 z-10 text-[10px] tracking-[0.22em] font-mono text-ivory-50 bg-black/55 px-2 py-1 backdrop-blur-sm uppercase pointer-events-none">
          {afterLabel}
        </span>

        {!hasMoved && (
          <span className="absolute bottom-5 left-1/2 -translate-x-1/2 text-[11px] uppercase tracking-[0.18em]
                           text-ivory-50/80 font-mono pointer-events-none">
            ← Drag to reveal →
          </span>
        )}
      </div>
    </figure>
  );
}
