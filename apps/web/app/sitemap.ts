import type { MetadataRoute } from "next";

const BASE = "https://harleystreetmedics.clinic";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: `${BASE}/pigmentation-glasgow`, lastModified: now, changeFrequency: "weekly",  priority: 1.0 },
    { url: `${BASE}/pigmentation-faq`,     lastModified: now, changeFrequency: "monthly", priority: 0.8 },
  ];
}
