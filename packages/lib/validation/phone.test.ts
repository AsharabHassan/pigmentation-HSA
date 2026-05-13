import { describe, it, expect } from "vitest";
import { normalizePhone, isValidMobile } from "./phone";

describe("normalizePhone", () => {
  it("normalizes UK mobile with country code to E.164", () => {
    expect(normalizePhone("07911123456", "GB")).toBe("+447911123456");
  });

  it("normalizes already-E.164 number unchanged", () => {
    expect(normalizePhone("+447911123456", "GB")).toBe("+447911123456");
  });

  it("returns null for unparseable input", () => {
    expect(normalizePhone("not a number", "GB")).toBeNull();
  });

  it("returns null for landline when only mobiles allowed", () => {
    expect(normalizePhone("02079460958", "GB")).toBeNull();
  });
});

describe("isValidMobile", () => {
  it("true for UK mobile", () => {
    expect(isValidMobile("+447911123456", "GB")).toBe(true);
  });

  it("false for UK landline", () => {
    expect(isValidMobile("+442079460958", "GB")).toBe(false);
  });
});
