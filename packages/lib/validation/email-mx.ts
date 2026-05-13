/**
 * Verify the email's domain has at least one MX record via Cloudflare DoH.
 * Fail-open on network errors — never block legitimate users for transient DNS issues.
 */
export async function hasMxRecord(email: string): Promise<boolean> {
  const at = email.lastIndexOf("@");
  if (at < 1 || at >= email.length - 3) return false;
  const domain = email.slice(at + 1).trim().toLowerCase();

  try {
    const url = `https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(domain)}&type=MX`;
    const res = await fetch(url, {
      headers: { accept: "application/dns-json" },
      signal: AbortSignal.timeout(1500),
    });
    if (!res.ok) return true;
    const json = (await res.json()) as { Status: number; Answer?: unknown[] };
    if (json.Status !== 0) return false;
    return Array.isArray(json.Answer) && json.Answer.length > 0;
  } catch {
    return true;
  }
}
