"use client";
import Link from "next/link";
import Image from "next/image";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { Container } from "../primitives/Container";
import { Input } from "../primitives/Input";
import { Camera, Upload, Lock, RotateCcw, ShieldCheck } from "lucide-react";
import { CartographyAtlas, type AtlasZone } from "./CartographyAtlas";

type Phase = "idle" | "preview" | "scanning" | "gate" | "revealed" | "error";

interface SkinZone {
  region: string;
  x: number;
  y: number;
  radius: number;
  type: string;
  intensity: number;
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
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ imageBase64: base64, mediaType }),
        }),
        new Promise(r => setTimeout(r, 2200)),
      ]);

      if (!res.ok) throw new Error(`Server error ${res.status}`);

      const data = (await res.json()) as { ok: boolean; analysis?: SkinAnalysis; error?: string };
      if (!data.ok || !data.analysis) {
        throw new Error(data.error || "Analysis failed");
      }
      setAnalysis(data.analysis);
      setPhase("gate"); // ← Lead gate before reveal
    } catch (e) {
      console.error("[scanner]", e);
      setError(e instanceof Error ? e.message : "Analysis failed");
      setPhase("error");
    }
  };

  const reset = () => {
    if (imgUrl) URL.revokeObjectURL(imgUrl);
    setImgUrl(null);
    setAnalysis(null);
    setError(null);
    fileRef.current = null;
    setPhase("idle");
  };

  return (
    <section id="pigmentation-map" className="relative bg-surface-black overflow-hidden border-t border-gold-500/15">
      <Container width="wide" className="relative pt-20 md:pt-28 pb-20 md:pb-28">

        <div className="flex items-baseline justify-between gap-4 mb-3">
          <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-gold-500/70">
            Ch. V · AI Skin Analysis
          </p>
          <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-gold-500/35 tabular-nums">
            Powered by Claude vision
          </p>
        </div>
        <span aria-hidden className="block h-px bg-gold-500/15" />

        <h2 className="mt-10 font-display italic text-[clamp(2.5rem,11vw,7rem)] leading-[0.9] text-ivory-50 max-w-5xl">
          Read your skin<br />
          <span className="text-gold-400">like a clinician.</span>
        </h2>
        <p className="mt-6 text-base md:text-lg text-ivory-50/65 max-w-2xl leading-relaxed">
          Upload a well-lit selfie. Our AI analyses your pigmentation pattern, renders a private atlas, and matches you with the right protocol — your full report unlocks once we know where to send it.
        </p>

        <div className="mt-14 md:mt-20">
          {phase === "idle"     && <IdleState onFile={handleFile} />}
          {phase === "preview"  && imgUrl && <PreviewState imgUrl={imgUrl} onStart={startScan} onReset={reset} />}
          {phase === "scanning" && imgUrl && <ScanningState imgUrl={imgUrl} />}
          {phase === "gate"     && analysis && (
            <LeadGateState
              analysis={analysis}
              onUnlock={() => setPhase("revealed")}
              onReset={reset}
            />
          )}
          {phase === "revealed" && analysis && <RevealedState analysis={analysis} onReset={reset} />}
          {phase === "error"    && <ErrorState message={error ?? "Something went wrong"} onReset={reset} />}
        </div>

        <div className="mt-10 flex flex-wrap items-center gap-x-5 gap-y-2 text-[10px] uppercase tracking-[0.28em] text-gold-500/55 font-mono">
          <span className="flex items-center gap-2">
            <ShieldCheck size={11} aria-hidden />
            Image sent securely; not stored after analysis
          </span>
          <span className="text-gold-500/20">·</span>
          <span>Not a diagnosis</span>
          <span className="text-gold-500/20">·</span>
          <span>Final assessment in clinic</span>
        </div>
      </Container>
    </section>
  );
}

function IdleState({ onFile }: { onFile: (f: File) => void }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-[60%_40%] gap-10 items-center">
      <div className="aspect-[4/5] bg-surface-charcoal ring-1 ring-gold-500/30 overflow-hidden">
        <CartographyAtlas seed={42} zoneCount={9} skin="III" preview />
      </div>
      <div>
        <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-gold-500/70 mb-4">Begin</p>
        <h3 className="font-display italic text-3xl md:text-4xl text-ivory-50 leading-tight">
          Compose your atlas.
        </h3>
        <p className="mt-4 text-ivory-50/65 leading-relaxed text-sm md:text-base">
          A clear, forward-facing selfie in natural light works best. Claude vision analyses your pigmentation pattern, estimates your skin type, and proposes a calibrated protocol.
        </p>

        <label className="mt-8 group block cursor-pointer">
          <input type="file" accept="image/jpeg,image/png,image/webp" className="sr-only"
                 onChange={e => e.target.files?.[0] && onFile(e.target.files[0])} />
          <span className="flex items-center justify-between gap-4 bg-gold-500 text-ink-900 px-6 py-4
                           group-hover:bg-gold-400 transition-colors">
            <span className="flex items-center gap-3">
              <Upload size={18} aria-hidden />
              <span className="font-mono text-xs uppercase tracking-[0.24em] font-semibold">
                Upload selfie
              </span>
            </span>
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] opacity-60">
              JPG · PNG · WEBP · ≤8MB
            </span>
          </span>
        </label>

        <div className="mt-3 flex items-center justify-between gap-4 border border-ink-300/15 px-6 py-4 opacity-40">
          <span className="flex items-center gap-3">
            <Camera size={18} className="text-ivory-50/40" aria-hidden />
            <span className="font-mono text-xs uppercase tracking-[0.22em] text-ivory-50/40">
              Live capture
            </span>
          </span>
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-ivory-50/40">
            Coming soon
          </span>
        </div>

        <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.22em] text-gold-500/45 leading-loose">
          Your image is sent to our secure server for analysis, processed in seconds, and discarded. We never store or share it.
        </p>
      </div>
    </div>
  );
}

function PreviewState({
  imgUrl, onStart, onReset,
}: { imgUrl: string; onStart: () => void; onReset: () => void }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-[60%_40%] gap-10 items-start">
      <div className="relative aspect-[4/5] bg-surface-charcoal ring-1 ring-gold-500/30 overflow-hidden">
        <Image src={imgUrl} alt="" fill unoptimized className="object-cover opacity-90" />
        <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/30" />
        <div className="absolute bottom-4 left-4 font-mono text-[10px] uppercase tracking-[0.22em] text-gold-500/80">
          <Lock size={12} className="inline mr-1.5 -mt-0.5" aria-hidden />
          Held in browser memory
        </div>
      </div>

      <div>
        <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-gold-500/70">Ready</p>
        <h3 className="mt-3 font-display italic text-3xl md:text-4xl text-ivory-50 leading-tight">
          Selfie loaded.
        </h3>
        <p className="mt-4 text-ivory-50/65 leading-relaxed text-sm md:text-base">
          Claude will analyse pigmentation patterns, estimate your skin type, and recommend a protocol calibrated to your case.
        </p>

        <button
          type="button"
          onClick={onStart}
          className="mt-8 group flex items-center justify-between gap-4 w-full
                     bg-gold-500 text-ink-900 px-6 py-4 hover:bg-gold-400 transition-colors"
        >
          <span className="font-mono text-xs uppercase tracking-[0.24em] font-semibold">
            Analyse with AI
          </span>
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] opacity-60">
            ~ 5 sec
          </span>
        </button>

        <button
          type="button"
          onClick={onReset}
          className="mt-3 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-gold-500/55 hover:text-gold-400"
        >
          <RotateCcw size={12} aria-hidden /> Choose a different photo
        </button>
      </div>
    </div>
  );
}

function ScanningState({ imgUrl }: { imgUrl: string }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-[60%_40%] gap-10 items-start">
      <div className="relative aspect-[4/5] bg-surface-charcoal ring-1 ring-gold-500/30 overflow-hidden">
        <Image src={imgUrl} alt="" fill unoptimized className="object-cover opacity-30" />
        <div aria-hidden className="absolute inset-0 bg-surface-black/70" />
        <div className="absolute inset-0">
          <CartographyAtlas zones={[]} skin="III" scanning />
        </div>
        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between
                        font-mono text-[10px] uppercase tracking-[0.22em] text-gold-500/80">
          <span>Claude is analysing your skin…</span>
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 bg-gold-400 animate-pulse" />
            <span>Live</span>
          </span>
        </div>
      </div>

      <div>
        <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-gold-500/70">Reading</p>
        <h3 className="mt-3 font-display italic text-3xl md:text-4xl text-ivory-50 leading-tight">
          Resolving your atlas…
        </h3>
        <p className="mt-4 text-ivory-50/65 leading-relaxed text-sm md:text-base">
          Identifying pigmentation zones, estimating Fitzpatrick type, and matching against the clinic&apos;s treatment protocols.
        </p>
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

function LeadGateState({
  analysis, onUnlock, onReset,
}: { analysis: SkinAnalysis; onUnlock: () => void; onReset: () => void }) {
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
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          fullName: form.fullName,
          email: form.email,
          rawPhone: form.phone,
          phoneCountry: form.phoneCountry,
          consent: form.consent,
          marketingConsent: form.marketingConsent,
          source: "lp-pigmentation-scanner",
          // Map Claude's analysis into the quiz schema so it lands in GHL with full context
          quiz: {
            primary_concern: mapConcernToQuiz(analysis.dominant_concern),
            duration: "years",
            fitzpatrick: analysis.fitzpatrick,
            tried_before: ["nothing"],
            goal: analysis.severity === "severe" ? "clear" : "80% reduction",
            timing: "within a month",
            location: "Glasgow",
          },
          utm,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.ok) {
        const msg =
          data?.fieldErrors
            ? Object.values(data.fieldErrors).join(" · ")
            : data?.error || `Server error ${res.status}`;
        throw new Error(msg);
      }
      // Unlock the reveal regardless of GHL status — KV fallback handles delivery
      onUnlock();
    } catch (e) {
      setServerError(e instanceof Error ? e.message : "Could not unlock report");
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-[55%_45%] gap-10 items-start">
      {/* Blurred preview — what they'll get */}
      <div className="relative">
        <div className="relative aspect-[4/5] bg-surface-charcoal ring-1 ring-gold-500/30 overflow-hidden">
          <div className="absolute inset-0 blur-md">
            <CartographyAtlas zones={atlasZones} skin={analysis.fitzpatrick} />
          </div>
          <div aria-hidden className="absolute inset-0 bg-surface-black/35" />
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center">
              <Lock size={36} className="text-gold-400 mx-auto" aria-hidden />
              <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.32em] text-gold-400">
                Locked
              </p>
            </div>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-2 font-mono text-[10px] uppercase tracking-[0.22em]">
          <SpecCell label="Zones" value={analysis.zones.length.toString().padStart(2, "0")} />
          <SpecCell label="Skin Type" value={`Fitzpatrick ${analysis.fitzpatrick}`} />
          <SpecCell label="Concern" value={CONCERN_LABEL[analysis.dominant_concern] ?? "—"} />
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="md:pt-2">
        <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-gold-500/70">
          One last step
        </p>
        <h3 className="mt-3 font-display italic text-3xl md:text-4xl text-ivory-50 leading-tight">
          Unlock your full report.
        </h3>
        <p className="mt-4 text-ivory-50/65 leading-relaxed text-sm md:text-base">
          Tell us where to send your atlas. We&apos;ll also reach out within one working day to offer a free online consultation.
        </p>

        <div className="mt-7 flex flex-col gap-4">
          <Input
            id="scanner-name" label="Full name *" autoComplete="name"
            {...register("fullName", { required: true, minLength: 2 })}
          />
          <Input
            id="scanner-email" label="Email *" type="email" autoComplete="email"
            {...register("email", { required: true, pattern: /^[^@\s]+@[^@\s]+\.[^@\s]+$/ })}
          />
          <div className="grid grid-cols-[110px_1fr] gap-3">
            <div>
              <label htmlFor="scanner-country" className="block text-xs uppercase tracking-[0.18em] text-gold-500 mb-2">
                Country
              </label>
              <select id="scanner-country"
                className="w-full bg-ivory-200 border border-ink-300 px-3 py-3 text-base text-ink-900 focus:border-gold-500 outline-none"
                {...register("phoneCountry")}>
                <option value="GB">🇬🇧 +44</option>
                <option value="IE">🇮🇪 +353</option>
                <option value="US">🇺🇸 +1</option>
                <option value="AE">🇦🇪 +971</option>
                <option value="PK">🇵🇰 +92</option>
                <option value="IN">🇮🇳 +91</option>
              </select>
            </div>
            <Input
              id="scanner-phone" label="Mobile *" type="tel" autoComplete="tel"
              helpText="We'll send your atlas + booking link by SMS"
              {...register("phone", { required: true, minLength: 7 })}
            />
          </div>

          <label className="flex items-start gap-3 text-sm text-ivory-50/85 cursor-pointer">
            <input type="checkbox" className="mt-1 accent-gold-500" {...register("consent", { required: true })} />
            <span>I consent to be contacted about my plan by the clinic. <span className="text-error-500">*</span></span>
          </label>
          <label className="flex items-start gap-3 text-sm text-ivory-50/70 cursor-pointer">
            <input type="checkbox" className="mt-1 accent-gold-500" {...register("marketingConsent")} />
            <span>Send me occasional skincare tips. (Optional)</span>
          </label>

          {serverError && (
            <p className="text-sm text-error-500">{serverError}</p>
          )}

          <button
            type="submit"
            disabled={!isValid || !consentChecked || isSubmitting}
            className="mt-2 inline-flex items-center justify-between bg-gold-500 text-ink-900 px-6 py-4
                       text-[11px] uppercase tracking-[0.24em] font-semibold
                       hover:bg-gold-400 transition-colors
                       disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <span>{isSubmitting ? "Unlocking…" : "Unlock my report"}</span>
            <span className="font-mono text-[10px] opacity-60">→</span>
          </button>

          <p className="text-[10px] font-mono uppercase tracking-[0.22em] text-gold-500/45">
            🔒 Encrypted. GDPR-compliant. Never shared.
          </p>

          <button
            type="button"
            onClick={onReset}
            className="self-start flex items-center gap-2 mt-2 font-mono text-[10px] uppercase tracking-[0.22em] text-gold-500/55 hover:text-gold-400"
          >
            <RotateCcw size={12} aria-hidden /> Try a different photo
          </button>
        </div>
      </form>
    </div>
  );
}

function RevealedState({
  analysis, onReset,
}: { analysis: SkinAnalysis; onReset: () => void }) {
  const atlasZones: AtlasZone[] = analysis.zones.map(z => ({
    x: z.x, y: z.y, radius: z.radius, intensity: z.intensity, region: z.region,
  }));

  return (
    <div className="grid grid-cols-1 md:grid-cols-[55%_45%] gap-10 items-start">
      <div className="relative aspect-[4/5] bg-surface-charcoal ring-1 ring-gold-500/50 overflow-hidden">
        <CartographyAtlas zones={atlasZones} skin={analysis.fitzpatrick} />
      </div>

      <div className="md:pt-4">
        <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-gold-500/70">
          {analysis.analyzed_by === "claude" ? "Your AI analysis" : "Fallback analysis"}
        </p>
        <h3 className="mt-3 font-display italic text-3xl md:text-4xl text-ivory-50 leading-tight">
          {analysis.recommended_protocol}
        </h3>

        <p className="mt-5 text-ivory-50/80 text-base leading-relaxed">
          {analysis.notes}
        </p>

        <dl className="mt-8 space-y-3 font-mono text-xs uppercase tracking-[0.22em]">
          <DataRow k="Dominant concern" v={CONCERN_LABEL[analysis.dominant_concern] ?? analysis.dominant_concern} />
          <DataRow k="Severity"         v={analysis.severity} />
          <DataRow k="Skin type"        v={`Fitzpatrick ${analysis.fitzpatrick}`} />
          <DataRow k="Zones identified" v={analysis.zones.length.toString().padStart(2, "0")} />
          <DataRow k="Estimated plan"   v={analysis.estimated_sessions} />
          <DataRow k="Confidence"       v={analysis.confidence} />
        </dl>

        <div className="mt-8 flex flex-col sm:flex-row gap-3">
          <Link href="#book"
            className="inline-flex items-center justify-between bg-gold-500 text-ink-900 px-6 py-4
                       text-[11px] uppercase tracking-[0.24em] font-semibold hover:bg-gold-400 transition-colors">
            <span>Book free consultation</span>
            <span className="font-mono text-[10px] opacity-60 ml-3">→</span>
          </Link>
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center justify-center gap-2 border border-gold-500/40 text-ivory-50 px-6 py-4
                       text-[11px] uppercase tracking-[0.24em] font-semibold
                       hover:bg-gold-500 hover:text-ink-900 hover:border-gold-500 transition-colors"
          >
            <RotateCcw size={13} aria-hidden /> Try another
          </button>
        </div>
      </div>
    </div>
  );
}

function ErrorState({ message, onReset }: { message: string; onReset: () => void }) {
  return (
    <div className="border border-gold-500/30 bg-surface-charcoal p-8 md:p-12 max-w-2xl">
      <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-gold-500/60">Couldn&apos;t analyse</p>
      <h3 className="mt-3 font-display italic text-2xl md:text-3xl text-ivory-50">
        Let&apos;s try a different photo.
      </h3>
      <p className="mt-3 text-ivory-50/70 text-sm">{message}</p>
      <button
        type="button"
        onClick={onReset}
        className="mt-6 inline-flex items-center gap-2 bg-gold-500 text-ink-900 px-5 py-3
                   text-[11px] uppercase tracking-[0.24em] font-semibold hover:bg-gold-400 transition-colors"
      >
        <RotateCcw size={12} aria-hidden /> Start over
      </button>
    </div>
  );
}

function SpecCell({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-t border-gold-500/20 pt-2">
      <div className="text-gold-500/55 text-[9px]">{label}</div>
      <div className="text-ivory-50 mt-0.5 truncate">{value}</div>
    </div>
  );
}

function DataRow({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-gold-500/15 pb-2">
      <dt className="text-ivory-50/45">{k}</dt>
      <dd className="text-ivory-50 text-right">{v}</dd>
    </div>
  );
}

// Map Claude's dominant_concern to the quiz schema enum
function mapConcernToQuiz(concern: string): string {
  const map: Record<string, string> = {
    melasma: "melasma",
    "sun-damage": "sun-damage",
    "post-acne": "post-acne",
    "uneven-tone": "uneven-tone",
    "lip-pigment": "lip-pigment",
    other: "not-sure",
    "none-detected": "not-sure",
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
    utm_source:       p.get("utm_source"),
    utm_medium:       p.get("utm_medium"),
    utm_campaign:     p.get("utm_campaign"),
    utm_term:         p.get("utm_term"),
    gclid:            p.get("gclid"),
    fbclid:           p.get("fbclid"),
    landing_page_url: window.location.href,
    referrer:         document.referrer || null,
  };
}

async function downscaleAndEncode(
  file: File, maxSide: number, jpegQuality: number,
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
    canvas.toBlob(
      b => (b ? resolve(b) : reject(new Error("Could not encode image"))),
      "image/jpeg",
      jpegQuality,
    );
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
