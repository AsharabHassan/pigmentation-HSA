import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

const kvSet = vi.fn();
vi.mock("@vercel/kv", () => ({ kv: { set: kvSet, get: vi.fn(), del: vi.fn() } }));

const ghlMock = vi.fn();
vi.mock("@lib/ghl/client", () => ({ ghlUpsertContact: ghlMock }));

const originalFetch = globalThis.fetch;

import { POST } from "./route";

const validBody = {
  fullName: "Sarah O'Connor",
  email: "sarah@example.com",
  rawPhone: "07911123456",
  phoneCountry: "GB",
  consent: true,
  marketingConsent: false,
  source: "lp-pigmentation",
  quiz: {
    primary_concern: "melasma", duration: "years", fitzpatrick: "IV",
    tried_before: ["prescription"], goal: "80% reduction",
    timing: "this week", location: "Glasgow",
  },
  utm: {
    utm_source: "google", utm_medium: "cpc", utm_campaign: "pig-glasgow",
    utm_term: "laser pigmentation removal glasgow",
    gclid: null, fbclid: null,
    landing_page_url: "https://example.com/pigmentation-glasgow",
    referrer: null,
  },
};

function req(body: unknown) {
  return new Request("http://localhost/api/lead/submit", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
}

beforeEach(() => {
  vi.clearAllMocks();
  process.env.GHL_API_KEY = "x"; process.env.GHL_LOCATION_ID = "y";
  // Mock MX lookups so tests don't hit real DNS
  globalThis.fetch = vi.fn().mockResolvedValue({
    ok: true,
    json: async () => ({ Status: 0, Answer: [{ type: 15, data: "10 mx.example.com." }] }),
  } as Response);
});
afterEach(() => { globalThis.fetch = originalFetch; });

describe("POST /api/lead/submit", () => {
  it("returns 200 with reveal payload on happy path", async () => {
    ghlMock.mockResolvedValue({ ok: true, contactId: "c-1" });
    const res = await POST(req(validBody));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.ok).toBe(true);
    expect(body.reveal.recommendedProtocol).toBe("Signature 3-Step");
    expect(body.reveal.estimatedSessions).toBe("4-6 over 12 weeks");
    expect(ghlMock).toHaveBeenCalledOnce();
    expect(kvSet).not.toHaveBeenCalled();
  });

  it("returns 400 on validation failure", async () => {
    const res = await POST(req({ ...validBody, email: "nope" }));
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.ok).toBe(false);
    expect(body.fieldErrors.email).toBeDefined();
  });

  it("returns 400 when phone is a landline", async () => {
    const res = await POST(req({ ...validBody, rawPhone: "02079460958" }));
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.fieldErrors.phone).toBeDefined();
  });

  it("queues to KV and still returns 200 when GHL fails", async () => {
    ghlMock.mockResolvedValue({ ok: false, status: 503 });
    const res = await POST(req(validBody));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.ok).toBe(true);
    expect(kvSet).toHaveBeenCalled();
    const [key] = kvSet.mock.calls[0];
    expect(key).toMatch(/^leads:failed:/);
  });

  it("rejects non-JSON body", async () => {
    const res = await POST(new Request("http://localhost/api/lead/submit", {
      method: "POST", body: "not json",
    }));
    expect(res.status).toBe(400);
  });
});
