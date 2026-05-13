import { kv } from "@vercel/kv";
import { ghlUpsertContact } from "@lib/ghl/client";
import type { GhlContact } from "@lib/ghl/types";

export const runtime = "edge";
export const dynamic = "force-dynamic";

interface QueuedLead {
  contact: GhlContact;
  lead: unknown;
  attempts: number;
  firstAttempt: number;
}

const MAX_ATTEMPTS = 12;
const PATTERN = "leads:failed:*";

export async function GET(req: Request): Promise<Response> {
  const auth = req.headers.get("authorization");
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  const keys = await kv.keys(PATTERN);
  let succeeded = 0, failed = 0, abandoned = 0;

  for (const key of keys) {
    const queued = await kv.get<QueuedLead>(key);
    if (!queued) { await kv.del(key); continue; }

    if (queued.attempts >= MAX_ATTEMPTS) {
      await kv.del(key);
      abandoned++;
      continue;
    }

    const result = await ghlUpsertContact(queued.contact);
    if (result.ok) {
      await kv.del(key);
      succeeded++;
    } else {
      const updated: QueuedLead = { ...queued, attempts: queued.attempts + 1 };
      await kv.set(key, JSON.stringify(updated), { ex: 60 * 60 * 24 * 7 });
      failed++;
    }
  }

  return Response.json({ ok: true, succeeded, failed, abandoned });
}
