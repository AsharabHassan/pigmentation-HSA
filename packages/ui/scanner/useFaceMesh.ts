"use client";
import { useEffect, useRef, useState } from "react";
import {
  FaceLandmarker, FilesetResolver, type FaceLandmarkerResult,
} from "@mediapipe/tasks-vision";

export interface ScanResult {
  zones: number;
  fitzpatrick: "I" | "II" | "III" | "IV" | "V" | "VI";
  landmarks: FaceLandmarkerResult | null;
}

export function useFaceMesh() {
  const [ready, setReady] = useState(false);
  const landmarker = useRef<FaceLandmarker | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const vision = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm",
        );
        const fl = await FaceLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",
            delegate: "GPU",
          },
          outputFaceBlendshapes: false,
          runningMode: "IMAGE",
          numFaces: 1,
        });
        if (cancelled) { fl.close(); return; }
        landmarker.current = fl;
        setReady(true);
      } catch (e) {
        console.warn("[scanner] MediaPipe failed to load", e);
      }
    })();
    return () => {
      cancelled = true;
      landmarker.current?.close();
      landmarker.current = null;
    };
  }, []);

  async function runOnce(imageEl: HTMLImageElement | HTMLVideoElement): Promise<ScanResult | null> {
    if (!landmarker.current) return null;
    const result = landmarker.current.detect(imageEl);
    const ctx = makeCtx(imageEl);
    const { zones, fitz } = analyseRegions(ctx, result);
    return { zones, fitzpatrick: fitz, landmarks: result };
  }

  return { ready, runOnce };
}

function makeCtx(src: HTMLImageElement | HTMLVideoElement) {
  const w = "videoWidth" in src ? src.videoWidth : src.naturalWidth;
  const h = "videoHeight" in src ? src.videoHeight : src.naturalHeight;
  const canvas = document.createElement("canvas");
  canvas.width = w; canvas.height = h;
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(src, 0, 0, w, h);
  return ctx;
}

function srgbToLab(r: number, g: number, b: number): [number, number, number] {
  const l = (c: number) => { c /= 255; return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); };
  const R = l(r), G = l(g), B = l(b);
  const X = R * 0.4124 + G * 0.3576 + B * 0.1805;
  const Y = R * 0.2126 + G * 0.7152 + B * 0.0722;
  const Z = R * 0.0193 + G * 0.1192 + B * 0.9505;
  const f = (t: number) => (t > 0.008856 ? Math.cbrt(t) : (7.787 * t) + 16 / 116);
  const fx = f(X / 0.95047), fy = f(Y / 1.0), fz = f(Z / 1.08883);
  return [116 * fy - 16, 500 * (fx - fy), 200 * (fy - fz)];
}

function analyseRegions(
  ctx: CanvasRenderingContext2D,
  result: FaceLandmarkerResult,
): { zones: number; fitz: ScanResult["fitzpatrick"] } {
  const landmarks = result.faceLandmarks?.[0];
  if (!landmarks) return { zones: 0, fitz: "III" };

  const w = ctx.canvas.width, h = ctx.canvas.height;
  const regionIdx = [10, 234, 454, 4, 152] as const;

  let totalL = 0;
  let zones = 0;
  const samples: number[][] = regionIdx.map(() => []);

  for (let i = 0; i < regionIdx.length; i++) {
    const lm = landmarks[regionIdx[i]];
    const cx = Math.floor(lm.x * w);
    const cy = Math.floor(lm.y * h);
    const r = Math.max(10, Math.floor(Math.min(w, h) * 0.02));
    const data = ctx.getImageData(cx - r, cy - r, r * 2, r * 2).data;
    for (let j = 0; j < data.length; j += 4) {
      const [L] = srgbToLab(data[j], data[j + 1], data[j + 2]);
      samples[i].push(L);
      totalL += L;
    }
  }

  const flat = samples.flat();
  const mean = totalL / flat.length;

  for (const region of samples) {
    if (region.length === 0) continue;
    const regionMean = region.reduce((a, b) => a + b, 0) / region.length;
    if (regionMean < mean - 4) zones += 1;
    const darkPixels = region.filter(L => L < regionMean - 6).length / region.length;
    if (darkPixels > 0.15) zones += 2;
  }

  const fitz =
    mean > 80 ? "I" :
    mean > 72 ? "II" :
    mean > 62 ? "III" :
    mean > 52 ? "IV" :
    mean > 38 ? "V" : "VI";

  return { zones, fitz };
}
