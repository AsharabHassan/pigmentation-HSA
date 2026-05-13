"use client";
import { useId, useState, type ReactNode } from "react";
import { Plus, Minus } from "lucide-react";
import { Container } from "../primitives/Container";
import { buildFaqJsonLd, type FaqEntry } from "@lib/schema/faq-jsonld";

interface Props {
  heading: string;
  entries: FaqEntry[];
  id?: string;
}

function Item({ question, children }: { question: string; children: ReactNode }) {
  const id = useId();
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-surface-200">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={`${id}-panel`}
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-start justify-between gap-4 py-5 md:py-6 text-left
                   text-ink-900 hover:text-clay-600 transition-colors"
      >
        <span className="text-base md:text-lg font-medium">{question}</span>
        <span className="shrink-0 mt-1 text-clay-500">
          {open ? <Minus size={20} /> : <Plus size={20} />}
        </span>
      </button>
      <div id={`${id}-panel`} hidden={!open} className="pb-6 text-ink-700 leading-relaxed">
        {children}
      </div>
    </div>
  );
}

export function FAQ({ heading, entries, id = "faq" }: Props) {
  const ld = buildFaqJsonLd(entries);
  return (
    <section id={id} className="bg-surface-50 py-20 md:py-28">
      <Container width="content">
        <div className="text-center mb-10 md:mb-14">
          <p className="text-[11px] uppercase tracking-[0.18em] text-clay-500 font-semibold mb-3">
            Frequently asked
          </p>
          <h2 className="font-display text-4xl md:text-6xl text-ink-900 leading-[1.05] max-w-3xl mx-auto">
            {heading}
          </h2>
        </div>
        <div className="border-t border-surface-200">
          {entries.map((e, i) => (
            <Item key={i} question={e.question}>
              <p>{e.answer}</p>
            </Item>
          ))}
        </div>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }}
        />
      </Container>
    </section>
  );
}
