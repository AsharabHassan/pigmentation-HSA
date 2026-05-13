import { describe, it, expect } from "vitest";
import { scoreLead, leadTag } from "./score";
import type { Lead } from "../validation/lead-schema";

const base: Lead = {
  fullName: "Sarah O'Connor",
  email: "s@x.com",
  phone: "+447911123456",
  consent: true,
  marketingConsent: false,
  source: "lp-pigmentation",
  quiz: {
    primary_concern: "uneven-tone",
    duration: "<6mo",
    fitzpatrick: "III",
    tried_before: ["nothing"],
    goal: "clear",
    timing: "researching",
    location: "UK-other",
  },
  utm: { utm_source: null, utm_medium: null, utm_campaign: null, utm_term: null,
         gclid: null, fbclid: null, landing_page_url: null, referrer: null },
};

describe("scoreLead", () => {
  it("baseline scores low", () => {
    expect(scoreLead(base)).toBeLessThan(25);
  });

  it("hot lead = this-week + melasma + years + Glasgow + prescription + mobile", () => {
    const hot: Lead = {
      ...base,
      quiz: { ...base.quiz!,
        primary_concern: "melasma", duration: "years",
        timing: "this week", location: "Glasgow",
        tried_before: ["prescription"] },
    };
    expect(scoreLead(hot)).toBeGreaterThanOrEqual(50);
    expect(leadTag(scoreLead(hot))).toBe("lead-hot");
  });

  it("warm lead = within-a-month + sun-damage (no Glasgow boost)", () => {
    const warm: Lead = {
      ...base,
      quiz: { ...base.quiz!,
        primary_concern: "sun-damage",
        timing: "within a month", location: "UK-other" },
    };
    const s = scoreLead(warm);
    expect(s).toBeGreaterThanOrEqual(25);
    expect(s).toBeLessThan(50);
    expect(leadTag(s)).toBe("lead-warm");
  });

  it("cold lead = researching + no Glasgow", () => {
    expect(leadTag(scoreLead(base))).toBe("lead-cold");
  });

  it("scores 5 (mobile only) when quiz absent", () => {
    expect(scoreLead({ ...base, quiz: undefined })).toBe(5);
  });
});
