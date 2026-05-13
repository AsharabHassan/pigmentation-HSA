"use client";
import { clsx } from "clsx";
import type { ReactNode } from "react";

interface Props {
  label: string;
  sublabel?: ReactNode;
  onClick: () => void;
  selected?: boolean;
  disabled?: boolean;
}

export function Tile({ label, sublabel, onClick, selected, disabled }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={!!selected}
      disabled={disabled}
      className={clsx(
        "text-left p-5 border transition-all duration-200",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-200",
        selected
          ? "bg-aubergine-900 border-aubergine-900 text-ivory-50"
          : "bg-ivory-100 border-ink-300/40 text-ink-900 hover:border-gold-500 hover:bg-ivory-50",
      )}
    >
      <span className="block text-base font-medium">{label}</span>
      {sublabel && (
        <span className={clsx("block text-sm mt-1", selected ? "text-ivory-100/70" : "text-ink-500")}>
          {sublabel}
        </span>
      )}
    </button>
  );
}
