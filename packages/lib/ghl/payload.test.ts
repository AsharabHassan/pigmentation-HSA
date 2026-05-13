import { describe, it, expect } from "vitest";
import { buildGhlContact } from "./payload";
import type { Lead } from "../validation/lead-schema";

const lead: Lead = {
  fullName: "Sarah O'Connor",
  email: "sarah@example.com",
  phone: "+447911123456",
  consent: true,
  marketingConsent: true,
  source: "lp-pigmentation",
  quiz: {
    primary_concern: "melasma",
    duration: "years",
    fitzpatrick: "IV",
    tried_before: ["prescription"],
    goal: "80% reduction",
    timing: "this week",
    location: "Glasgow",
  },
  utm: {
    utm_source: "google", utm_medium: "cpc",
    utm_campaign: "pigmentation-glasgow",
    utm_term: "laser pigmentation removal glasgow",
    gclid: "abc123", fbclid: null,
    landing_page_url: "https://example.com/pigmentation-glasgow",
    referrer: null,
  },
};

describe("buildGhlContact", () => {
  it("splits full name into first + last", () => {
    const c = buildGhlContact(lead, "Pigmentation LP — Glasgow", "lead-hot", 75);
    expect(c.firstName).toBe("Sarah");
    expect(c.lastName).toBe("O'Connor");
  });

  it("handles single-name input", () => {
    const c = buildGhlContact({ ...lead, fullName: "Cher" }, "src", "lead-cold", 5);
    expect(c.firstName).toBe("Cher");
    expect(c.lastName).toBe("");
  });

  it("emits expected tags", () => {
    const c = buildGhlContact(lead, "src", "lead-hot", 75);
    expect(c.tags).toEqual(expect.arrayContaining([
      "lp-pigmentation", "quiz-complete", "concern-melasma",
      "fitzpatrick-IV", "urgency-this-week", "loc-glasgow", "lead-hot",
    ]));
  });

  it("forwards UTM + score in customFields", () => {
    const c = buildGhlContact(lead, "src", "lead-hot", 75);
    expect(c.customFields.utm_source).toBe("google");
    expect(c.customFields.utm_term).toBe("laser pigmentation removal glasgow");
    expect(c.customFields.gclid).toBe("abc123");
    expect(c.customFields.lead_score).toBe(75);
    expect(c.customFields.recommended_protocol).toBe("Signature 3-Step");
  });
});
