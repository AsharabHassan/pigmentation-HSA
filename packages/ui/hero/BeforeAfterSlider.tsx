"use client";
import Image from "next/image";
import { useCallback, useRef, useState, useEffect } from "react";

export interface BeforeAfterSliderProps {
  beforeSrc: string;
  afterSrc: string;
  beforeAlt: string;
  afterAlt: string;
  initialPercent?: number;
  className?: string;
}

export function BeforeAfterSlider({
  beforeSrc, afterSrc, beforeAlt, afterAlt,
  initialPercent = 50, className,
}: BeforeAfterSliderProps) {
  const [percent, setPercent] = useState(initialPercent);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);

  const updateFromClientX = useCallback((clientX: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const next = ((clientX - rect.left) / rect.width) * 100;
    setPercent(Math.max(0, Math.min(100, next)));
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
    if (e.key === "ArrowRight") setPercent(p => Math.min(100, p + 5));
    if (e.key === "ArrowLeft") setPercent(p => Math.max(0, p - 5));
    if (e.key === "Home") setPercent(0);
    if (e.key === "End") setPercent(100);
  };

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t1 = setTimeout(() => setPercent(p => p + 4), 1200);
    const t2 = setTimeout(() => setPercent(p => p - 4), 1500);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative w-full aspect-[4/5] overflow-hidden select-none ${className ?? ""}`}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      <Image
        src={afterSrc} alt={afterAlt} fill priority sizes="(max-width: 768px) 100vw, 60vw"
        className="object-cover"
      />
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ clipPath: `inset(0 ${100 - percent}% 0 0)` }}
      >
        <Image
          src={beforeSrc} alt={beforeAlt} fill priority sizes="(max-width: 768px) 100vw, 60vw"
          className="object-cover"
        />
      </div>
      <div
        aria-hidden
        className="absolute top-0 bottom-0 w-px bg-ivory-50/95 shadow-[0_0_12px_rgba(0,0,0,0.35)]"
        style={{ left: `${percent}%` }}
      />
      <button
        type="button"
        role="slider"
        aria-label="Drag to reveal the after image"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(percent)}
        tabIndex={0}
        onKeyDown={onKeyDown}
        className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2
                   w-12 h-12 rounded-full bg-ivory-50 border-2 border-gold-500
                   shadow-[0_4px_20px_rgba(42,20,34,0.4)] cursor-grab active:cursor-grabbing
                   flex items-center justify-center text-ink-900"
        style={{ left: `${percent}%` }}
      >
        <span aria-hidden>◀▶</span>
      </button>
      <span className="absolute top-4 left-4 text-xs uppercase tracking-wider
                       text-ivory-50 bg-ink-900/55 px-2 py-1 backdrop-blur-sm">
        Before
      </span>
      <span className="absolute top-4 right-4 text-xs uppercase tracking-wider
                       text-ivory-50 bg-ink-900/55 px-2 py-1 backdrop-blur-sm">
        After
      </span>
    </div>
  );
}
