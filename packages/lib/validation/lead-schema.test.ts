import { describe, it, expect } from "vitest";
import { leadSchema } from "./lead-schema";

const valid = {
  fullName: "Sarah O'Connor",
  email: "sarah@example.com",
  phone: "+447911123456",
  consent: true,
  marketingConsent: false,
  source: "lp-pigmentation",
  quiz: {
    primary_concern: "melasma",
    duration: "years",
    fitzpatrick: "IV",
    tried_before: ["prescription", "OTC creams"],
    goal: "80% reduction",
    timing: "this week",
    location: "Glasgow",
  },
  utm: {
    utm_source: "google", utm_medium: "cpc",
    utm_campaign: "pigmentation-glasgow",
    utm_term: "laser pigmentation removal glasgow",
    gclid: "abc", fbclid: null,
    landing_page_url: "https://example.com/pigmentation-glasgow",
    referrer: null,
  },
};

describe("leadSchema", () => {
  it("accepts a fully-populated valid payload", () => {
    expect(leadSchema.safeParse(valid).success).toBe(true);
  });

  it("rejects missing required fields", () => {
    expect(leadSchema.safeParse({ ...valid, fullName: "" }).success).toBe(false);
  });

  it("rejects missing required consent", () => {
    expect(leadSchema.safeParse({ ...valid, consent: false }).success).toBe(false);
  });

  it("rejects malformed email", () => {
    expect(leadSchema.safeParse({ ...valid, email: "not-an-email" }).success).toBe(false);
  });

  it("rejects single-character name", () => {
    expect(leadSchema.safeParse({ ...valid, fullName: "S" }).success).toBe(false);
  });

  it("allows omitted utm fields", () => {
    const r = leadSchema.safeParse({
      ...valid,
      utm: { utm_source: null, utm_medium: null, utm_campaign: null, utm_term: null,
             gclid: null, fbclid: null, landing_page_url: null, referrer: null },
    });
    expect(r.success).toBe(true);
  });

  it("allows quiz partial — abandon recovery", () => {
    expect(leadSchema.safeParse({ ...valid, quiz: undefined }).success).toBe(true);
  });
});
