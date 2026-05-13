import type { GhlContact } from "./types";

export interface GhlResult {
  ok: boolean;
  status?: number;
  contactId?: string;
  error?: string;
}

const GHL_BASE = "https://services.leadconnectorhq.com";

export async function ghlUpsertContact(contact: GhlContact): Promise<GhlResult> {
  const apiKey = process.env.GHL_API_KEY;
  const locationId = process.env.GHL_LOCATION_ID;
  if (!apiKey || !locationId) {
    return { ok: false, error: "GHL_API_KEY or GHL_LOCATION_ID not configured" };
  }

  const body = {
    locationId,
    firstName: contact.firstName,
    lastName: contact.lastName,
    email: contact.email,
    phone: contact.phone,
    source: contact.source,
    tags: contact.tags,
    customFields: Object.entries(contact.customFields)
      .filter(([, v]) => v !== null && v !== undefined)
      .map(([key, value]) => ({ key, field_value: value })),
  };

  try {
    const res = await fetch(`${GHL_BASE}/contacts/upsert`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Version": "2021-07-28",
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(5000),
    });

    if (!res.ok) return { ok: false, status: res.status };
    const json = (await res.json()) as { contact?: { id?: string } };
    return { ok: true, status: res.status, contactId: json.contact?.id };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : String(e) };
  }
}
