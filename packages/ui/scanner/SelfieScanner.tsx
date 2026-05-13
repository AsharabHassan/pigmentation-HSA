"use client";
import Link from "next/link";
import Image from "next/image";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { Container } from "../primitives/Container";
import { Input } from "../primitives/Input";
import { Camera, Upload, Lock, RotateCcw, ShieldCheck, Sparkles } from "lucide-react";
import { CartographyAtlas, type AtlasZone } from "./CartographyAtlas";

type Phase = "idle" | "preview" | "scanning" | "gate" | "revealed" | "error";

interface SkinZone {
  region: string;
  x: number; y: number; radius: number;
  type: string; intensity: number;
}
interface SkinAnalysis {
  fitzpatrick: "I" | "II" | "III" | "IV" | "V" | "VI";
  dominant_concern: string;
  severity: "mild" | "moderate" | "severe";
  zones: SkinZone[];
  recommended_protocol: string;
  estimated_sessions: string;
  notes: string;
  confidence: "low" | "medium" | "high";
  analyzed_by: "claude" | "fallback";
}

const CONCERN_LABEL: Record<string, string> = {
  melasma: "Melasma",
  "sun-damage": "Sun damage",
  "post-acne": "Post-acne marks",
  "uneven-tone": "Uneven tone",
  "lip-pigment": "Lip pigmentation",
  other: "Mixed pigmentation",
  "none-detected": "No visible pigmentation",
};

export function SelfieScanner() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [imgUrl, setImgUrl] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<SkinAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<File | null>(null);

  const handleFile = (file: File) => {
    fileRef.current = file;
    const url = URL.createObjectURL(file);
    setImgUrl(url);
    setPhase("preview");
  };

  const startScan = async () => {
    if (!fileRef.current) return;
    setPhase("scanning");
    setError(null);
    try {
      const { base64, mediaType } = await downscaleAndEncode(fileRef.current, 1024, 0.82);
      const [res] = await Promise.all([
        fetch("/api/analyze-skin", {
          method: "POST", headers: { "content-type": "application/json" },
          body: JSON.stringify({ imageBase64: base64, mediaType }),
        }),
        new Promise(r => setTimeout(r, 2200)),
      ]);
      if (!res.ok) throw new Error(`Server error ${res.status}`);
      const data = (await res.json()) as { ok: boolean; analysis?: SkinAnalysis; error?: string };
      if (!data.ok || !data.analysis) throw new Error(data.error || "Analysis failed");
      setAnalysis(data.analysis);
      setPhase("gate");
    } catch (e) {
      console.error("[scanner]", e);
      setError(e instanceof Error ? e.message : "Analysis failed");
      setPhase("error");
    }
  };

  const reset = () => {
    if (imgUrl) URL.revokeObjectURL(imgUrl);
    setImgUrl(null); setAnalysis(null); setError(null);
    fileRef.current = null; setPhase("idle");
  };

  return (
    <section id="pigmentation-map" className="bg-surface-100 py-20 md:py-28">
      <Container width="wide">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 md:mb-16">
          <div>
            <p className="text-[11px] uppercase tracking-[0.18em] text-clay-500 font-semibold mb-3 flex items-center gap-2">
              <Sparkles size={14} className="text-clay-500" aria-hidden />
              AI skin scan · free
            </p>
            <h2 className="font-display text-4xl md:text-6xl text-ink-900 leading-[1.05] max-w-3xl">
              See what&apos;s happening<br />
              <span className="text-clay-600">on your skin.</span>
            </h2>
          </div>
          <p className="text-base text-ink-700 max-w-sm">
            Upload a clear selfie. Our AI maps your pigmentation pattern and matches a protocol. Takes about 5 seconds.
          </p>
        </div>

        <div>
          {phase === "idle"     && <IdleState onFile={handleFile} />}
          {phase === "preview"  && imgUrl && <PreviewState imgUrl={imgUrl} onStart={startScan} onReset={reset} />}
          {phase === "scanning" && imgUrl && <ScanningState imgUrl={imgUrl} />}
          {phase === "gate"     && analysis && (
            <LeadGateState analysis={analysis} onUnlock={() => setPhase("revealed")} onReset={reset} />
          )}
          {phase === "revealed" && analysis && <RevealedState analysis={analysis} onReset={reset} />}
          {phase === "error"    && <ErrorState message={error ?? "Something went wrong"} onReset={reset} />}
        </div>

        <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-ink-500">
          <span className="flex items-center gap-2">
            <ShieldCheck size={14} className="text-moss-500" aria-hidden />
            Sent securely · never stored
          </span>
          <span className="text-ink-300">·</span>
          <span>Not a diagnosis</span>
          <span className="text-ink-300">·</span>
          <span>Final assessment in clinic</span>
        </div>
      </Container>
    </section>
  );
}

function IdleState({ onFile }: { onFile: (f: File) => void }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-[55%_45%] gap-10 items-center">
      <div className="rounded-2xl overflow-hidden border border-surface-200 bg-surface-50 aspect-[4/5]">
        <CartographyAtlas seed={42} zoneCount={9} skin="III" preview />
      </div>
      <div>
        <h3 className="font-display text-3xl md:text-4xl text-ink-900 leading-tight">
          Ready to see it?
        </h3>
        <p className="mt-4 text-ink-700 leading-relaxed">
          A clear, forward-facing selfie in natural light works best. The AI picks out pigmentation zones, estimates your Fitzpatrick skin type, and proposes the right protocol.
        </p>

        <label className="mt-7 group block cursor-pointer">
          <input type="file" accept="image/jpeg,image/png,image/webp" className="sr-only"
                 onChange={e => e.target.files?.[0] && onFile(e.target.files[0])} />
          <span className="flex items-center justify-between gap-4 bg-clay-500 text-surface-50 px-6 py-4
                           rounded-full group-hover:bg-clay-600 transition-colors">
            <span className="flex items-center gap-3">
              <Upload size={18} aria-hidden />
              <span className="text-[13px] uppercase tracking-[0.12em] font-semibold">Upload a selfie</span>
            </span>
            <span className="text-[11px] uppercase tracking-[0.1em] opacity-70">JPG · PNG · WEBP</span>
          </span>
        </label>

        <div className="mt-3 flex items-center justify-between gap-4 border border-surface-200 px-6 py-4 rounded-full opacity-40">
          <span className="flex items-center gap-3">
            <Camera size={18} className="text-ink-500" aria-hidden />
            <span className="text-[13px] uppercase tracking-[0.12em] text-ink-500 font-semibold">Use webcam</span>
          </span>
          <span className="text-[11px] uppercase tracking-[0.1em] text-ink-500">Coming soon</span>
        </div>

        <p className="mt-6 text-xs text-ink-500 leading-relaxed">
          Image is sent to our secure server for analysis, then discarded. We never store or share it.
        </p>
      </div>
    </div>
  );
}

function PreviewState({ imgUrl, onStart, onReset }: {
  imgUrl: string; onStart: () => void; onReset: () => void;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-[55%_45%] gap-10 items-start">
      <div className="relative aspect-[4/5] bg-surface-50 rounded-2xl overflow-hidden border border-surface-200">
        <Image src={imgUrl} alt="" fill unoptimized className="object-cover" />
        <div className="absolute bottom-4 left-4 bg-surface-50/95 text-ink-900 text-[11px] uppercase tracking-[0.14em]
                        px-2.5 py-1 rounded-full font-semibold flex items-center gap-1.5">
          <Lock size={11} aria-hidden /> Held in browser
        </div>
      </div>

      <div>
        <h3 className="font-display text-3xl md:text-4xl text-ink-900 leading-tight">
          Looks good. Ready?
        </h3>
        <p className="mt-4 text-ink-700 leading-relaxed">
          Claude vision will analyse pigmentation patterns, estimate your skin type, and recommend a calibrated protocol.
        </p>

        <button type="button" onClick={onStart}
          className="mt-7 group flex items-center justify-between gap-4 w-full
                     bg-clay-500 text-surface-50 px-6 py-4 rounded-full
                     hover:bg-clay-600 transition-colors">
          <span className="text-[13px] uppercase tracking-[0.12em] font-semibold">Analyse with AI</span>
          <span className="text-[11px] uppercase tracking-[0.1em] opacity-70">~5 sec</span>
        </button>

        <button type="button" onClick={onReset}
          className="mt-3 flex items-center gap-2 text-sm text-ink-500 hover:text-clay-600">
          <RotateCcw size={14} aria-hidden /> Choose a different photo
        </button>
      </div>
    </div>
  );
}

function ScanningState({ imgUrl }: { imgUrl: string }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-[55%_45%] gap-10 items-start">
      <div className="relative aspect-[4/5] rounded-2xl overflow-hidden border border-surface-200 bg-surface-50">
        <Image src={imgUrl} alt="" fill unoptimized className="object-cover opacity-30" />
        <div aria-hidden className="absolute inset-0 bg-surface-50/60" />
        <div className="absolute inset-0">
          <CartographyAtlas zones={[]} skin="III" scanning />
        </div>
        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between
                        text-[11px] uppercase tracking-[0.14em] font-semibold">
          <span className="bg-surface-50/95 text-ink-900 px-2.5 py-1 rounded-full">Analysing…</span>
          <span className="flex items-center gap-1.5 bg-clay-500 text-surface-50 px-2.5 py-1 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-surface-50 animate-pulse" /> Live
          </span>
        </div>
      </div>

      <div>
        <h3 className="font-display text-3xl md:text-4xl text-ink-900 leading-tight">
          Reading your skin…
        </h3>
        <p className="mt-4 text-ink-700 leading-relaxed">
          Identifying pigmentation zones, estimating your Fitzpatrick type, and matching against the clinic&apos;s protocols.
        </p>
        <div className="mt-7 space-y-2 text-sm text-ink-500">
          {["Detecting zones", "Estimating skin type", "Matching protocol"].map((step, i) => (
            <div key={i} className="flex items-center gap-3">
              <motion.span
                initial={{ scale: 0.6, opacity: 0.4 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.4, delay: i * 0.4, repeat: Infinity, repeatType: "reverse" }}
                className="w-2 h-2 rounded-full bg-clay-500"
              />
              {step}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

interface LeadFormFields {
  fullName: string;
  email: string;
  phone: string;
  phoneCountry: string;
  consent: boolean;
  marketingConsent: boolean;
}

function LeadGateState({ analysis, onUnlock, onReset }: {
  analysis: SkinAnalysis; onUnlock: () => void; onReset: () => void;
}) {
  const { register, handleSubmit, formState: { isValid, isSubmitting }, watch } = useForm<LeadFormFields>({
    mode: "onChange",
    defaultValues: { phoneCountry: "GB", consent: false, marketingConsent: false },
  });
  const [serverError, setServerError] = useState<string | null>(null);
  const consentChecked = watch("consent");

  const atlasZones: AtlasZone[] = analysis.zones.map(z => ({
    x: z.x, y: z.y, radius: z.radius, intensity: z.intensity, region: z.region,
  }));

  const onSubmit = async (form: LeadFormFields) => {
    setServerError(null);
    try {
      const utm = readUtm();
      const res = await fetch("/api/lead/submit", {
        method: "POST", headers: { "content-type": "application/json" },
        body: JSON.stringify({
          fullName: form.fullName, email: form.email,
          rawPhone: form.phone, phoneCountry: form.phoneCountry,
          consent: form.consent, marketingConsent: form.marketingConsent,
          source: "lp-pigmentation-scanner",
          quiz: {
            primary_concern: mapConcernToQuiz(analysis.dominant_concern),
            duration: "years", fitzpatrick: analysis.fitzpatrick,
            tried_before: ["nothing"],
            goal: analysis.severity === "severe" ? "clear" : "80% reduction",
            timing: "within a month", location: "Glasgow",
          },
          utm,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        const msg = data?.fieldErrors
          ? Object.values(data.fieldErrors).join(" · ")
          : data?.error || `Server error ${res.status}`;
        throw new Error(msg);
      }
      onUnlock();
    } catch (e) {
      setServerError(e instanceof Error ? e.message : "Could not unlock report");
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-[50%_50%] gap-10 items-start">
      <div className="relative">
        <div className="relative aspect-[4/5] rounded-2xl overflow-hidden border border-surface-200 bg-surface-50">
          <div className="absolute inset-0 blur-md">
            <CartographyAtlas zones={atlasZones} skin={analysis.fitzpatrick} />
          </div>
          <div aria-hidden className="absolute inset-0 bg-surface-50/30" />
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center bg-surface-50/95 rounded-full px-6 py-4 shadow-lg">
              <Lock size={20} className="text-clay-500 mx-auto" aria-hidden />
              <p className="mt-2 text-[11px] uppercase tracking-[0.14em] text-ink-700 font-semibold">
                Your atlas is ready
              </p>
            </div>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-2">
          <Cell label="Zones" value={analysis.zones.length.toString().padStart(2, "0")} />
          <Cell label="Skin Type" value={`F-${analysis.fitzpatrick}`} />
          <Cell label="Concern" value={CONCERN_LABEL[analysis.dominant_concern] ?? "—"} />
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <p className="text-[11px] uppercase tracking-[0.18em] text-clay-500 font-semibold">
          Almost there
        </p>
        <h3 className="mt-3 font-display text-3xl md:text-4xl text-ink-900 leading-tight">
          Where should we send it?
        </h3>
        <p className="mt-3 text-ink-700 leading-relaxed">
          Your atlas, recommended protocol, and a link to book a free online consultation with Dr. Ahmad.
        </p>

        <div className="mt-7 flex flex-col gap-4">
          <Input id="scanner-name" label="Full name *" autoComplete="name"
                 {...register("fullName", { required: true, minLength: 2 })} />
          <Input id="scanner-email" label="Email *" type="email" autoComplete="email"
                 {...register("email", { required: true, pattern: /^[^@\s]+@[^@\s]+\.[^@\s]+$/ })} />
          <div className="grid grid-cols-[110px_1fr] gap-3">
            <div>
              <label htmlFor="scanner-country" className="block text-xs uppercase tracking-[0.12em] text-ink-500 mb-2 font-semibold">
                Country
              </label>
              <select id="scanner-country"
                className="w-full bg-surface-50 border border-surface-200 px-3 py-3 text-base text-ink-900
                           focus:border-clay-500 outline-none rounded-lg"
                {...register("phoneCountry")}>
                <option value="GB">🇬🇧 +44</option>
                <option value="IE">🇮🇪 +353</option>
                <option value="US">🇺🇸 +1</option>
                <option value="AE">🇦🇪 +971</option>
                <option value="PK">🇵🇰 +92</option>
                <option value="IN">🇮🇳 +91</option>
              </select>
            </div>
            <Input id="scanner-phone" label="Mobile *" type="tel" autoComplete="tel"
                   helpText="We'll text you a booking link"
                   {...register("phone", { required: true, minLength: 7 })} />
          </div>

          <label className="flex items-start gap-3 text-sm text-ink-700 cursor-pointer">
            <input type="checkbox" className="mt-1 accent-clay-500" {...register("consent", { required: true })} />
            <span>I consent to be contacted about my plan by the clinic. <span className="text-error-500">*</span></span>
          </label>
          <label className="flex items-start gap-3 text-sm text-ink-500 cursor-pointer">
            <input type="checkbox" className="mt-1 accent-clay-500" {...register("marketingConsent")} />
            <span>Send me occasional skincare tips. (Optional)</span>
          </label>

          {serverError && <p className="text-sm text-error-500">{serverError}</p>}

          <button type="submit" disabled={!isValid || !consentChecked || isSubmitting}
            className="mt-2 inline-flex items-center justify-between gap-3 bg-clay-500 text-surface-50 px-6 py-4
                       rounded-full text-[13px] uppercase tracking-[0.12em] font-semibold
                       hover:bg-clay-600 transition-colors
                       disabled:opacity-40 disabled:cursor-not-allowed">
            <span>{isSubmitting ? "Unlocking…" : "See my full report"}</span>
            <span aria-hidden>→</span>
          </button>

          <p className="text-xs text-ink-500 flex items-center gap-2">
            <Lock size={11} aria-hidden /> Encrypted · GDPR-compliant · Never shared
          </p>

          <button type="button" onClick={onReset}
            className="self-start flex items-center gap-2 mt-2 text-sm text-ink-500 hover:text-clay-600">
            <RotateCcw size={14} aria-hidden /> Try a different photo
          </button>
        </div>
      </form>
    </div>
  );
}

function RevealedState({ analysis, onReset }: { analysis: SkinAnalysis; onReset: () => void }) {
  const atlasZones: AtlasZone[] = analysis.zones.map(z => ({
    x: z.x, y: z.y, radius: z.radius, intensity: z.intensity, region: z.region,
  }));

  return (
    <div className="grid grid-cols-1 md:grid-cols-[50%_50%] gap-10 items-start">
      <div className="relative aspect-[4/5] rounded-2xl overflow-hidden border-2 border-clay-300 bg-surface-50">
        <CartographyAtlas zones={atlasZones} skin={analysis.fitzpatrick} />
      </div>

      <div>
        <p className="text-[11px] uppercase tracking-[0.18em] text-clay-500 font-semibold flex items-center gap-2">
          <Sparkles size={13} aria-hidden />
          {analysis.analyzed_by === "claude" ? "Your AI analysis" : "Initial analysis"}
        </p>
        <h3 className="mt-3 font-display text-3xl md:text-4xl text-ink-900 leading-tight">
          {analysis.recommended_protocol}
        </h3>

        <p className="mt-5 text-ink-700 text-base leading-relaxed">
          {analysis.notes}
        </p>

        <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-4 text-sm">
          <Row k="Dominant concern" v={CONCERN_LABEL[analysis.dominant_concern] ?? analysis.dominant_concern} />
          <Row k="Severity" v={analysis.severity} />
          <Row k="Skin type" v={`Fitzpatrick ${analysis.fitzpatrick}`} />
          <Row k="Zones identified" v={analysis.zones.length.toString().padStart(2, "0")} />
          <Row k="Estimated plan" v={analysis.estimated_sessions} />
          <Row k="Confidence" v={analysis.confidence} />
        </dl>

        <div className="mt-8 flex flex-col sm:flex-row gap-3">
          <Link href="#book"
            className="inline-flex items-center justify-center gap-2 bg-clay-500 text-surface-50 px-6 py-4
                       rounded-full text-[13px] uppercase tracking-[0.12em] font-semibold
                       hover:bg-clay-600 transition-colors">
            Book free consultation →
          </Link>
          <button type="button" onClick={onReset}
            className="inline-flex items-center justify-center gap-2 border border-surface-200 text-ink-900 px-6 py-4
                       rounded-full text-[13px] uppercase tracking-[0.12em] font-semibold
                       hover:bg-ink-900 hover:text-surface-50 hover:border-ink-900 transition-colors">
            <RotateCcw size={14} aria-hidden /> Try another
          </button>
        </div>
      </div>
    </div>
  );
}

function ErrorState({ message, onReset }: { message: string; onReset: () => void }) {
  return (
    <div className="bg-surface-50 border border-surface-200 rounded-2xl p-8 md:p-10 max-w-2xl">
      <p className="text-[11px] uppercase tracking-[0.18em] text-clay-500 font-semibold">Couldn&apos;t analyse</p>
      <h3 className="mt-3 font-display text-3xl text-ink-900">Let&apos;s try a different photo.</h3>
      <p className="mt-3 text-ink-700">{message}</p>
      <button type="button" onClick={onReset}
        className="mt-6 inline-flex items-center gap-2 bg-clay-500 text-surface-50 px-5 py-3
                   rounded-full text-[13px] uppercase tracking-[0.12em] font-semibold hover:bg-clay-600 transition-colors">
        <RotateCcw size={14} aria-hidden /> Start over
      </button>
    </div>
  );
}

function Cell({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-surface-50 border border-surface-200 rounded-lg px-3 py-2">
      <div className="text-[10px] uppercase tracking-[0.14em] text-ink-500 font-semibold">{label}</div>
      <div className="text-ink-900 text-sm font-medium truncate mt-0.5">{value}</div>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div>
      <dt className="text-[10px] uppercase tracking-[0.14em] text-ink-500 font-semibold">{k}</dt>
      <dd className="text-ink-900 mt-1 capitalize">{v}</dd>
    </div>
  );
}

function mapConcernToQuiz(concern: string): string {
  const map: Record<string, string> = {
    melasma: "melasma", "sun-damage": "sun-damage", "post-acne": "post-acne",
    "uneven-tone": "uneven-tone", "lip-pigment": "lip-pigment",
    other: "not-sure", "none-detected": "not-sure",
  };
  return map[concern] ?? "not-sure";
}

function readUtm() {
  if (typeof window === "undefined") {
    return { utm_source: null, utm_medium: null, utm_campaign: null, utm_term: null,
             gclid: null, fbclid: null, landing_page_url: null, referrer: null };
  }
  const p = new URLSearchParams(window.location.search);
  return {
    utm_source: p.get("utm_source"), utm_medium: p.get("utm_medium"),
    utm_campaign: p.get("utm_campaign"), utm_term: p.get("utm_term"),
    gclid: p.get("gclid"), fbclid: p.get("fbclid"),
    landing_page_url: window.location.href, referrer: document.referrer || null,
  };
}

async function downscaleAndEncode(file: File, maxSide: number, jpegQuality: number,
): Promise<{ base64: string; mediaType: "image/jpeg" }> {
  const bitmap = await loadBitmap(file);
  const ratio = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height));
  const w = Math.round(bitmap.width * ratio);
  const h = Math.round(bitmap.height * ratio);
  const canvas = document.createElement("canvas");
  canvas.width = w; canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Browser canvas unavailable");
  ctx.drawImage(bitmap, 0, 0, w, h);
  const blob: Blob = await new Promise((resolve, reject) => {
    canvas.toBlob(b => (b ? resolve(b) : reject(new Error("Could not encode image"))), "image/jpeg", jpegQuality);
  });
  const base64 = await blobToBase64(blob);
  return { base64, mediaType: "image/jpeg" };
}

async function loadBitmap(file: File): Promise<ImageBitmap | HTMLImageElement> {
  if (typeof createImageBitmap === "function") {
    try { return await createImageBitmap(file); } catch { /* fall through */ }
  }
  const url = URL.createObjectURL(file);
  try {
    return await new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error("Could not load image"));
      img.src = url;
    });
  } finally { URL.revokeObjectURL(url); }
}

async function blobToBase64(blob: Blob): Promise<string> {
  const buf = await blob.arrayBuffer();
  const bytes = new Uint8Array(buf);
  let binary = "";
  const chunkSize = 0x8000;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
  }
  return typeof btoa !== "undefined" ? btoa(binary) : Buffer.from(binary, "binary").toString("base64");
}
