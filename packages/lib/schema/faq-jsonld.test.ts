import { describe, it, expect } from "vitest";
import { buildFaqJsonLd } from "./faq-jsonld";

describe("buildFaqJsonLd", () => {
  it("returns valid FAQPage shape", () => {
    const ld = buildFaqJsonLd([
      { question: "Q1?", answer: "A1." },
      { question: "Q2?", answer: "A2." },
    ]);
    expect(ld["@context"]).toBe("https://schema.org");
    expect(ld["@type"]).toBe("FAQPage");
    expect(ld.mainEntity).toHaveLength(2);
    expect(ld.mainEntity[0]).toEqual({
      "@type": "Question",
      name: "Q1?",
      acceptedAnswer: { "@type": "Answer", text: "A1." },
    });
  });
});
