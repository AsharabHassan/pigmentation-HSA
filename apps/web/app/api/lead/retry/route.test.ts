import { describe, it, expect, vi, beforeEach } from "vitest";

const kvKeys = vi.fn();
const kvGet  = vi.fn();
const kvSet  = vi.fn();
const kvDel  = vi.fn();
vi.mock("@vercel/kv", () => ({
  kv: { keys: kvKeys, get: kvGet, set: kvSet, del: kvDel },
}));

const ghlMock = vi.fn();
vi.mock("@lib/ghl/client", () => ({ ghlUpsertContact: ghlMock }));

import { GET } from "./route";

function req(secret: string) {
  return new Request("http://localhost/api/lead/retry", {
    headers: { Authorization: `Bearer ${secret}` },
  });
}

beforeEach(() => {
  vi.clearAllMocks();
  process.env.CRON_SECRET = "secret-123";
});

describe("GET /api/lead/retry", () => {
  it("401 without correct cron secret", async () => {
    const res = await GET(req("wrong"));
    expect(res.status).toBe(401);
  });

  it("retries failed leads, deletes on success", async () => {
    kvKeys.mockResolvedValue(["leads:failed:a", "leads:failed:b"]);
    kvGet.mockImplementation(async (k: string) => ({
      contact: { email: k },
      lead: {}, attempts: 1, firstAttempt: Date.now(),
    }));
    ghlMock.mockResolvedValue({ ok: true });

    const res = await GET(req("secret-123"));
    expect(res.status).toBe(200);
    expect(ghlMock).toHaveBeenCalledTimes(2);
    expect(kvDel).toHaveBeenCalledTimes(2);
  });

  it("increments attempts on failure", async () => {
    kvKeys.mockResolvedValue(["leads:failed:a"]);
    kvGet.mockResolvedValue({
      contact: { email: "a" }, lead: {}, attempts: 2, firstAttempt: Date.now(),
    });
    ghlMock.mockResolvedValue({ ok: false, status: 500 });

    await GET(req("secret-123"));
    expect(kvSet).toHaveBeenCalled();
    const [, payload] = kvSet.mock.calls[0];
    expect(JSON.parse(payload as string).attempts).toBe(3);
  });
});
