"use client";
import { useId, useState, type ReactNode } from "react";
import { Plus, Minus } from "lucide-react";
import { Section } from "../primitives/Section";
import { Container } from "../primitives/Container";
import { Eyebrow } from "../primitives/Eyebrow";
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
        className="w-full flex items-start justify-between gap-6 py-6 text-left
                   font-medium text-ivory-50 hover:text-gold-400 transition-colors"
      >
        <span className="text-lg">{question}</span>
        {open
          ? <Minus size={20} className="shrink-0 mt-1 text-gold-500" />
          : <Plus size={20} className="shrink-0 mt-1 text-gold-500" />}
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
    <Section id={id} className="bg-surface-black">
      <Container width="content">
        <Eyebrow>Frequently asked</Eyebrow>
        <h2 className="mt-3 font-display text-[clamp(2rem,3vw,2.75rem)] leading-tight text-ivory-50">
          {heading}
        </h2>
        <div className="mt-10 border-t border-gold-500/15">
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
