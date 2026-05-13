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

  return (
    <figure className={`relative w-full ${className ?? ""}`}>
      <div
        ref={containerRef}
        className="relative w-full aspect-[4/5] overflow-hidden bg-surface-100 select-none touch-none"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <Image src={afterSrc} alt={afterAlt} fill priority sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
        <div className="absolute inset-0 overflow-hidden" style={{ clipPath: `inset(0 ${100 - percent}% 0 0)` }}>
          <Image src={beforeSrc} alt={beforeAlt} fill priority sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
        </div>

        <div aria-hidden className="absolute top-0 bottom-0 pointer-events-none" style={{ left: `${percent}%`, transform: "translateX(-50%)" }}>
          <div
            className="absolute top-0 bottom-0 w-px left-0 bg-surface-50"
            style={{ boxShadow: dragging ? "0 0 12px rgba(184,90,60,0.6)" : "0 0 4px rgba(0,0,0,0.25)" }}
          />
        </div>

        <button
          type="button"
          role="slider"
          aria-label="Drag to reveal the after image"
          aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(percent)}
          tabIndex={0}
          onKeyDown={onKeyDown}
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2
                     w-12 h-12 rounded-full bg-surface-50 ring-2 ring-clay-500
                     shadow-[0_4px_16px_rgba(26,22,18,0.25)]
                     flex items-center justify-center text-clay-600
                     cursor-grab active:cursor-grabbing
                     focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-clay-300"
          style={{ left: `${percent}%` }}
        >
          <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden>
            <path d="M3 9 L6 6 L6 12 Z" fill="currentColor" />
            <path d="M15 9 L12 6 L12 12 Z" fill="currentColor" />
          </svg>
        </button>

        <span className="absolute top-4 left-4 z-10 text-[11px] uppercase tracking-[0.14em]
                         text-ink-900 bg-surface-50/95 px-2.5 py-1 rounded-full font-semibold">
          {beforeLabel}
        </span>
        <span className="absolute top-4 right-4 z-10 text-[11px] uppercase tracking-[0.14em]
                         text-surface-50 bg-clay-500 px-2.5 py-1 rounded-full font-semibold">
          {afterLabel}
        </span>

        {!hasMoved && (
          <span className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[11px] uppercase tracking-[0.14em]
                           text-ink-900 bg-surface-50/95 px-3 py-1.5 rounded-full font-semibold
                           pointer-events-none">
            ← Drag to see results →
          </span>
        )}
      </div>
    </figure>
  );
}
