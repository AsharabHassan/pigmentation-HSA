export const GHL_WEBHOOKS = {
  london: {
    pigmentation: "https://services.leadconnectorhq.com/hooks/8uElW7d5ZvUZkgLgQDN8/webhook-trigger/ger6uCFp9ShT2XUl0l8d",
    chemical_peels: "https://services.leadconnectorhq.com/hooks/8uElW7d5ZvUZkgLgQDN8/webhook-trigger/hSnEughB7XQZdCL65WYW",
    skin_glow_iv: "https://services.leadconnectorhq.com/hooks/8uElW7d5ZvUZkgLgQDN8/webhook-trigger/3Bt4YeottBoZ0j6yKWFt"
  },
  glasgow: {
    pigmentation: "https://services.leadconnectorhq.com/hooks/8uElW7d5ZvUZkgLgQDN8/webhook-trigger/QlxMqOuuPvuqt5JsG59h",
    chemical_peels: "https://services.leadconnectorhq.com/hooks/8uElW7d5ZvUZkgLgQDN8/webhook-trigger/L9P3SycX2WBp12BZyykI",
    skin_glow_iv: "https://services.leadconnectorhq.com/hooks/8uElW7d5ZvUZkgLgQDN8/webhook-trigger/VHSW86ZRhi199BB7sqTx"
  }
} as const;

export type ClinicLocation = keyof typeof GHL_WEBHOOKS;
export type CampaignType = keyof typeof GHL_WEBHOOKS['london'];
