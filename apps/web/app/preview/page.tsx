import { Button } from "@ui/primitives/Button";
import { Input } from "@ui/primitives/Input";
import { Card } from "@ui/primitives/Card";
import { Eyebrow } from "@ui/primitives/Eyebrow";
import { Pill } from "@ui/primitives/Pill";
import { Section } from "@ui/primitives/Section";
import { Container } from "@ui/primitives/Container";
import { Accordion, AccordionItem } from "@ui/primitives/Accordion";
import { NavBar } from "@ui/layout/NavBar";
import { Footer } from "@ui/layout/Footer";

export default function Preview() {
  return (
    <>
      <NavBar />
      <Section>
        <Container>
          <Eyebrow>Component Preview</Eyebrow>
          <h1 className="text-5xl font-display mt-2 mb-10">Design system</h1>

          <div className="flex flex-wrap gap-4 mb-10">
            <Button>Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="link">Link</Button>
          </div>

          <div className="max-w-md mb-10 flex flex-col gap-4">
            <Input id="name" label="Full name" />
            <Input id="email" label="Email" helpText="We'll send your plan here" />
            <Input id="bad" label="Phone" error="Required" />
          </div>

          <Card className="mb-10 max-w-md">
            <h3 className="text-xl font-display mb-2">Treatment card</h3>
            <p className="text-ink-700">Card content sits here.</p>
          </Card>

          <div className="flex gap-3 mb-10">
            <Pill>GMC ✓</Pill>
            <Pill>CQC ✓</Pill>
            <Pill>4.9★</Pill>
          </div>

          <Accordion>
            <AccordionItem question="Does laser pigmentation removal hurt?">
              Most patients describe it as a quick snap. We offer numbing cream on request.
            </AccordionItem>
            <AccordionItem question="How many sessions will I need?">
              Typically 4-6 sessions, spaced 3 weeks apart.
            </AccordionItem>
          </Accordion>
        </Container>
      </Section>
      <Footer />
    </>
  );
}
