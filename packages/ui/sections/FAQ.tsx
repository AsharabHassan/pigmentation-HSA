import { Section } from "../primitives/Section";
import { Container } from "../primitives/Container";
import { Eyebrow } from "../primitives/Eyebrow";
import { Accordion, AccordionItem } from "../primitives/Accordion";
import { buildFaqJsonLd, type FaqEntry } from "@lib/schema/faq-jsonld";

interface Props {
  heading: string;
  entries: FaqEntry[];
  id?: string;
}

export function FAQ({ heading, entries, id = "faq" }: Props) {
  const ld = buildFaqJsonLd(entries);
  return (
    <Section id={id} className="bg-ivory-50">
      <Container width="content">
        <Eyebrow>Frequently asked</Eyebrow>
        <h2 className="mt-3 font-display text-[clamp(2rem,3vw,2.5rem)] leading-tight text-ink-900">
          {heading}
        </h2>
        <div className="mt-10">
          <Accordion>
            {entries.map((e, i) => (
              <AccordionItem key={i} question={e.question}>
                <p>{e.answer}</p>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }}
        />
      </Container>
    </Section>
  );
}
