"use client";
import Link from "next/link";
import Image from "next/image";
import { useRef, useState } from "react";
import { Container } from "../primitives/Container";
import { Camera, Upload, Lock, RotateCcw, ShieldCheck } from "lucide-react";
import { CartographyAtlas, type AtlasZone } from "./CartographyAtlas";

type Phase = "idle" | "preview" | "scanning" | "revealed" | "error";

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
      const base64 = await fileToBase64(fileRef.current);
      const mediaType = (fileRef.current.type || "image/jpeg") as "image/jpeg" | "image/png" | "image/webp";

      // Min animation time so the scan feels deliberate
      const [res] = await Promise.all([
        fetch("/api/analyze-skin", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ imageBase64: base64, mediaType }),
        }),
        new Promise(r => setTimeout(r, 2200)),
      ]);

      const data = (await res.json()) as { ok: boolean; analysis?: SkinAnalysis; error?: string };
      if (!data.ok || !data.analysis) {
        throw new Error(data.error || "Analysis failed");
      }
      setAnalysis(data.analysis);
      setPhase("revealed");
    } catch (e) {
      console.error(e);
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
          Upload a well-lit selfie. Our AI analyses your pigmentation pattern and renders a private topographic atlas — non-diagnostic, but accurate enough to give you a personalised protocol recommendation.
        </p>

        <div className="mt-14 md:mt-20">
          {phase === "idle"     && <IdleState onFile={handleFile} />}
          {phase === "preview"  && imgUrl && <PreviewState imgUrl={imgUrl} onStart={startScan} onReset={reset} />}
          {phase === "scanning" && imgUrl && <ScanningState imgUrl={imgUrl} />}
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
}: {
  imgUrl: string;
  onStart: () => void;
  onReset: () => void;
}) {
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
          Claude will analyse pigmentation patterns, estimate your skin type, and recommend a protocol calibrated to your case. The image is sent securely and not stored.
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

function DataRow({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-gold-500/15 pb-2">
      <dt className="text-ivory-50/45">{k}</dt>
      <dd className="text-ivory-50 text-right">{v}</dd>
    </div>
  );
}

async function fileToBase64(file: File): Promise<string> {
  const buf = await file.arrayBuffer();
  const bytes = new Uint8Array(buf);
  // Build base64 in chunks to avoid stack overflow on large files
  let binary = "";
  const chunkSize = 0x8000;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
  }
  return typeof btoa !== "undefined" ? btoa(binary) : Buffer.from(binary, "binary").toString("base64");
}
