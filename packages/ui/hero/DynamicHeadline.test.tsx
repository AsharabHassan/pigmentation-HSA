import { describe, it, expect } from "vitest";
import { matchHeadline } from "./headline-map";

describe("matchHeadline", () => {
  it("matches melasma cluster", () => {
    expect(matchHeadline("melasma treatment")).toMatch(/melasma/i);
  });
  it("matches hyperpigmentation", () => {
    expect(matchHeadline("hyperpigmentation removal")).toMatch(/rebound/i);
  });
  it("matches glasgow geo", () => {
    expect(matchHeadline("laser pigmentation removal glasgow")).toMatch(/glasgow/i);
  });
  it("matches brightening", () => {
    expect(matchHeadline("skin brightening treatment")).toMatch(/brighter/i);
  });
  it("matches lip", () => {
    expect(matchHeadline("lip blushing near me")).toMatch(/lip colour/i);
  });
  it("matches sun damage", () => {
    expect(matchHeadline("fix sun damage on face")).toMatch(/sun damage/i);
  });
  it("default fallback", () => {
    expect(matchHeadline("unrelated query")).toMatch(/clear pigmentation/i);
  });
  it("null term", () => {
    expect(matchHeadline(null)).toMatch(/clear pigmentation/i);
  });
});
