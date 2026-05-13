"use client";
import { useId, useState, type ReactNode } from "react";
import { Plus, Minus } from "lucide-react";
import { Section } from "../primitives/Section";
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
    <div className="border-b border-gold-500/15">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={`${id}-panel`}
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-start justify-between gap-4 py-5 md:py-6 text-left
                   text-ivory-50 hover:text-gold-400 transition-colors"
      >
        <span className="text-base md:text-lg font-medium">{question}</span>
        <span className="shrink-0 mt-1 text-gold-500">
          {open ? <Minus size={20} /> : <Plus size={20} />}
        </span>
      </button>
      <div id={`${id}-panel`} hidden={!open} className="pb-6 text-ivory-50/70 leading-relaxed">
        {children}
      </div>
    </div>
  );
}

export function FAQ({ heading, entries, id = "faq" }: Props) {
  const ld = buildFaqJsonLd(entries);
  return (
    <Section id={id} className="bg-surface-black !py-16 md:!py-24">
      <Container width="content">
        <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-gold-500">Frequently asked</p>
        <h2 className="mt-3 font-display text-[clamp(2rem,7vw,2.75rem)] leading-[1.05] text-ivory-50 italic">
          {heading}
        </h2>
        <div className="mt-8 md:mt-10 border-t border-gold-500/15">
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
    </Section>
  );
}
