import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*",          allow: "/", disallow: ["/api/", "/preview", "/thanks"] },
      { userAgent: "GPTBot",     allow: "/" },
      { userAgent: "ClaudeBot",  allow: "/" },
      { userAgent: "PerplexityBot", allow: "/" },
    ],
    sitemap: "https://harleystreetmedics.clinic/sitemap.xml",
    host: "https://harleystreetmedics.clinic",
  };
}
