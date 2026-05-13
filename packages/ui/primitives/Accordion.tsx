"use client";
import { useId, useState, type ReactNode } from "react";
import { Plus, Minus } from "lucide-react";

export function Accordion({ children }: { children: ReactNode }) {
  return <div className="divide-y divide-ink-300/50 border-y border-ink-300/50">{children}</div>;
}

export function AccordionItem({
  question,
  children,
  defaultOpen = false,
}: {
  question: string;
  children: ReactNode;
  defaultOpen?: boolean;
}) {
  const id = useId();
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={`${id}-panel`}
        onClick={() => setOpen(v => !v)}
        onKeyDown={e => (e.key === "Enter" || e.key === " ") && setOpen(v => !v)}
        className="w-full flex items-start justify-between gap-6 py-6 text-left
                   font-medium text-ink-900 hover:text-aubergine-900 transition-colors"
      >
        <span className="text-lg">{question}</span>
        {open ? <Minus size={20} className="shrink-0 mt-1" /> : <Plus size={20} className="shrink-0 mt-1" />}
      </button>
      <div
        id={`${id}-panel`}
        hidden={!open}
        className="pb-6 text-ink-700 leading-relaxed"
      >
        {children}
      </div>
    </div>
  );
}
