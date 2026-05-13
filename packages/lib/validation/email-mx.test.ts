import { describe, it, expect, vi, beforeEach } from "vitest";
import { hasMxRecord } from "./email-mx";

const originalFetch = globalThis.fetch;

describe("hasMxRecord", () => {
  beforeEach(() => { globalThis.fetch = originalFetch; });

  it("returns true when domain has MX records", async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ Status: 0, Answer: [{ type: 15, data: "10 mx.example.com." }] }),
    } as Response);
    expect(await hasMxRecord("user@example.com")).toBe(true);
  });

  it("returns false when domain has no MX records", async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ Status: 0 }),
    } as Response);
    expect(await hasMxRecord("user@nope-example-abc.com")).toBe(false);
  });

  it("returns false on malformed email", async () => {
    expect(await hasMxRecord("not-an-email")).toBe(false);
  });

  it("returns true on network error (fail-open)", async () => {
    globalThis.fetch = vi.fn().mockRejectedValue(new Error("network"));
    expect(await hasMxRecord("user@example.com")).toBe(true);
  });
});
