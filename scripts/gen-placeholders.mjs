// Generate brand-aligned SVG placeholders.
// Run: node scripts/gen-placeholders.mjs
import { promises as fs } from "node:fs";
import path from "node:path";

const ROOT = path.resolve(process.cwd(), "apps/web/public/images");

function brandSvg({ width, height, label, sublabel, tone = "dark" }) {
  const bg = tone === "before" ? "#1A1308" : tone === "after" ? "#0F0F0F" : "#0A0A0A";
  const accent = "#C9A65C";
  const accentSoft = "#8C6B34";
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" preserveAspectRatio="xMidYMid slice">
  <defs>
    <radialGradient id="g" cx="50%" cy="35%" r="65%">
      <stop offset="0%"   stop-color="${accent}" stop-opacity="0.22"/>
      <stop offset="55%"  stop-color="${accentSoft}" stop-opacity="0.08"/>
      <stop offset="100%" stop-color="${bg}" stop-opacity="0"/>
    </radialGradient>
    <pattern id="grain" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
      <rect width="100" height="100" fill="${bg}"/>
      <circle cx="13" cy="22" r="0.6" fill="${accent}" opacity="0.07"/>
      <circle cx="67" cy="48" r="0.5" fill="${accent}" opacity="0.05"/>
      <circle cx="84" cy="11" r="0.4" fill="${accent}" opacity="0.06"/>
      <circle cx="33" cy="76" r="0.5" fill="${accent}" opacity="0.05"/>
      <circle cx="91" cy="83" r="0.6" fill="${accent}" opacity="0.07"/>
    </pattern>
  </defs>
  <rect width="100%" height="100%" fill="url(#grain)"/>
  <rect width="100%" height="100%" fill="url(#g)"/>
  <line x1="0" y1="${height * 0.78}" x2="${width}" y2="${height * 0.78}" stroke="${accent}" stroke-opacity="0.18" stroke-width="1"/>
  <text x="50%" y="${height * 0.82}" text-anchor="middle"
        font-family="Georgia, serif" font-size="${Math.floor(width / 14)}"
        font-style="italic" fill="${accent}" opacity="0.92">${label}</text>
  ${sublabel ? `<text x="50%" y="${height * 0.89}" text-anchor="middle"
        font-family="Inter, system-ui, sans-serif" font-size="${Math.floor(width / 30)}"
        letter-spacing="3" fill="${accent}" opacity="0.55">${sublabel.toUpperCase()}</text>` : ""}
</svg>`;
}

async function writeSvg(relPath, width, height, label, sublabel, tone) {
  const out = path.join(ROOT, relPath);
  await fs.mkdir(path.dirname(out), { recursive: true });
  await fs.writeFile(out, brandSvg({ width, height, label, sublabel, tone }));
  console.log(`wrote ${path.relative(process.cwd(), out)}  ${width}x${height}`);
}

async function main() {
  // .jpg extensions so existing component imports still resolve — Next next/image
  // serves them as image/svg+xml when given `unoptimized` or `dangerouslyAllowSVG`.
  // We're actually writing SVG content with .svg ext, and updating content files.

  // Hero — 4:5 portrait
  await writeSvg("hero/before-melasma.svg", 1000, 1250, "Before", "Visible pigmentation", "before");
  await writeSvg("hero/after-melasma.svg",  1000, 1250, "After",  "4 sessions",          "after");

  // Doctor — 4:5 portrait
  await writeSvg("doctor/portrait.svg",     1000, 1250, "Dr. M.T. Ahmad", "Clinical Director");

  // Timeline — 4:3
  const stages = [
    ["day-0.svg",  "Day 0",  "Starting point"],
    ["wk-2.svg",   "Week 2", "Initial response"],
    ["wk-4.svg",   "Week 4", "Clearance phase"],
    ["wk-6.svg",   "Week 6", "Tone evens"],
    ["wk-9.svg",   "Week 9", "Maintenance"],
    ["wk-12.svg",  "Week 12","Final result"],
  ];
  for (const [file, label, sub] of stages) {
    await writeSvg(`timeline/${file}`, 1200, 900, label, sub);
  }

  // Testimonials — square, before/after pairs
  const ppl = [
    ["aisha", "Aisha · Glasgow"],
    ["lena",  "Lena · Edinburgh"],
    ["chris", "Chris · Glasgow"],
  ];
  for (const [slug, label] of ppl) {
    await writeSvg(`testimonials/${slug}-before.svg`, 600, 600, "Before", label, "before");
    await writeSvg(`testimonials/${slug}-after.svg`,  600, 600, "After",  label, "after");
  }
}

main().catch(e => { console.error(e); process.exit(1); });
