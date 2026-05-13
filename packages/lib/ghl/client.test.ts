import { describe, it, expect, vi, beforeEach } from "vitest";
import { ghlUpsertContact } from "./client";
import type { GhlContact } from "./types";

const contact: GhlContact = {
  firstName: "Sarah", lastName: "O'Connor",
  email: "s@x.com", phone: "+447911123456",
  source: "lp", tags: [], customFields: {},
};

const originalFetch = globalThis.fetch;
const originalEnv = { ...process.env };

beforeEach(() => {
  globalThis.fetch = originalFetch;
  process.env = { ...originalEnv, GHL_API_KEY: "test-key", GHL_LOCATION_ID: "loc-1" };
});

describe("ghlUpsertContact", () => {
  it("POSTs to GHL contacts/upsert with bearer + version headers", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true, status: 200,
      json: async () => ({ contact: { id: "ct-1" } }),
    } as Response);
    globalThis.fetch = fetchMock;

    const res = await ghlUpsertContact(contact);
    expect(res.ok).toBe(true);
    expect(res.contactId).toBe("ct-1");

    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("https://services.leadconnectorhq.com/contacts/upsert");
    const headers = (init as RequestInit).headers as Record<string, string>;
    expect(headers["Authorization"]).toBe("Bearer test-key");
    expect(headers["Version"]).toBe("2021-07-28");
    const body = JSON.parse((init as RequestInit).body as string);
    expect(body.locationId).toBe("loc-1");
    expect(body.email).toBe("s@x.com");
  });

  it("returns ok=false with status on non-2xx", async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: false, status: 422, json: async () => ({ message: "bad" }),
    } as Response);
    const res = await ghlUpsertContact(contact);
    expect(res.ok).toBe(false);
    expect(res.status).toBe(422);
  });

  it("returns ok=false on network error", async () => {
    globalThis.fetch = vi.fn().mockRejectedValue(new Error("offline"));
    const res = await ghlUpsertContact(contact);
    expect(res.ok).toBe(false);
    expect(res.error).toMatch(/offline/);
  });
});
