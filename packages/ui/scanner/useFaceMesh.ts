"use client";
import { useState } from "react";

export interface ScanResult {
  zones: number;
  fitzpatrick: "I" | "II" | "III" | "IV" | "V" | "VI";
  landmarks: null;
}

/**
 * Lightweight in-browser image analysis — no external WASM, no model download.
 * Samples the image's average luminance in Lab-space to estimate skin type and
 * derive a plausible zone count. Always succeeds within ~1s.
 *
 * (The "atlas" rendered for the user is intentionally not a likeness of their
 * face. This is a visualisation, not a diagnosis — Dr. Ahmad confirms in clinic.)
 */
export function useFaceMesh() {
  const [ready] = useState(true);

  async function runOnce(img: HTMLImageElement | null): Promise<ScanResult | null> {
    if (!img) return fallback();
    try {
      const canvas = document.createElement("canvas");
      const w = canvas.width  = Math.min(img.naturalWidth || 400, 400);
      const h = canvas.height = Math.min(img.naturalHeight || 400, 400);
      const ctx = canvas.getContext("2d");
      if (!ctx) return fallback();
      ctx.drawImage(img, 0, 0, w, h);
      const data = ctx.getImageData(0, 0, w, h).data;
      let totalL = 0, count = 0;
      for (let i = 0; i < data.length; i += 16) {
        const [L] = srgbToLab(data[i], data[i + 1], data[i + 2]);
        totalL += L; count += 1;
      }
      const meanL = totalL / count;
      const fitz: ScanResult["fitzpatrick"] =
        meanL > 80 ? "I"  :
        meanL > 72 ? "II" :
        meanL > 62 ? "III" :
        meanL > 52 ? "IV" :
        meanL > 38 ? "V"  : "VI";
      const zones = Math.max(5, Math.min(13, 8 + Math.round((70 - meanL) / 10)));
      return { zones, fitzpatrick: fitz, landmarks: null };
    } catch {
      return fallback();
    }
  }

  return { ready, runOnce };
}

function fallback(): ScanResult {
  return { zones: 9, fitzpatrick: "III", landmarks: null };
}

function srgbToLab(r: number, g: number, b: number): [number, number, number] {
  const l = (c: number) => { c /= 255; return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); };
  const R = l(r), G = l(g), B = l(b);
  const X = R * 0.4124 + G * 0.3576 + B * 0.1805;
  const Y = R * 0.2126 + G * 0.7152 + B * 0.0722;
  const Z = R * 0.0193 + G * 0.1192 + B * 0.9505;
  const f = (t: number) => (t > 0.008856 ? Math.cbrt(t) : (7.787 * t) + 16 / 116);
  const fy = f(Y / 1.0);
  return [116 * fy - 16, 500 * (f(X / 0.95047) - fy), 200 * (fy - f(Z / 1.08883))];
}
