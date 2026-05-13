"use client";
import Link from "next/link";
import Image from "next/image";
import { useRef, useState } from "react";
import { Container } from "../primitives/Container";
import { useFaceMesh, type ScanResult } from "./useFaceMesh";
import { Camera, Upload, Lock, RotateCcw } from "lucide-react";
import { CartographyAtlas } from "./CartographyAtlas";

type Phase = "idle" | "preview" | "scanning" | "revealed";

const protocolFor = (skin: ScanResult["fitzpatrick"]) =>
  skin === "V" || skin === "VI"
    ? "Signature 3-Step (calibrated for Fitzpatrick V–VI)"
    : "Signature 3-Step";

const sessionsFor = (zones: number) =>
  zones >= 11 ? "5–6 sessions over 12 weeks"
  : zones >= 8 ? "4–5 sessions over 10 weeks"
  : "3–4 sessions over 9 weeks";

/**
 * Selfie scanner — upload → scan → show result. No lead form gate.
 * Result reveals immediately with a soft CTA to book a consultation.
 */
export function SelfieScanner() {
  const { runOnce } = useFaceMesh();
  const [phase, setPhase] = useState<Phase>("idle");
  const [imgUrl, setImgUrl] = useState<string | null>(null);
  const [scan, setScan] = useState<ScanResult | null>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  const handleFile = (file: File) => {
    const url = URL.createObjectURL(file);
    setImgUrl(url);
    setPhase("preview");
  };

  const startScan = async () => {
    if (!imgRef.current) return;
    setPhase("scanning");
    const [result] = await Promise.all([
      runOnce(imgRef.current),
      new Promise(r => setTimeout(r, 2400)),
    ]);
    setScan(result ?? { zones: 9, fitzpatrick: "III", landmarks: null });
    setPhase("revealed");
  };

  const reset = () => {
    if (imgUrl) URL.revokeObjectURL(imgUrl);
    setImgUrl(null);
    setScan(null);
    setPhase("idle");
  };

  return (
    <section id="pigmentation-map" className="relative bg-surface-black overflow-hidden border-t border-gold-500/15">
      <Container width="wide" className="relative pt-20 md:pt-28 pb-20 md:pb-28">

        <div className="flex items-baseline justify-between gap-4 mb-3">
          <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-gold-500/70">
            Ch. V · Pigmentation Map
          </p>
          <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-gold-500/35 tabular-nums">
            On-device · private
          </p>
        </div>
        <span aria-hidden className="block h-px bg-gold-500/15" />

        <h2 className="mt-10 font-display italic text-[clamp(2.5rem,11vw,7rem)] leading-[0.9] text-ivory-50 max-w-5xl">
          Read your skin<br />
          <span className="text-gold-400">like a map.</span>
        </h2>
        <p className="mt-6 text-base md:text-lg text-ivory-50/65 max-w-2xl leading-relaxed">
          Upload a well-lit selfie. We render a private topographic atlas of your pigmentation — your image never leaves your device.
        </p>

        <div className="mt-14 md:mt-20">
          {phase === "idle"     && <IdleState onFile={handleFile} />}
          {phase === "preview"  && imgUrl && <PreviewState imgUrl={imgUrl} imgRef={imgRef} onStart={startScan} onReset={reset} />}
          {phase === "scanning" && imgUrl && <ScanningState imgUrl={imgUrl} imgRef={imgRef} />}
          {phase === "revealed" && scan   && <RevealedState scan={scan} onReset={reset} />}
        </div>

        <div className="mt-10 flex items-center gap-3 text-[10px] uppercase tracking-[0.28em] text-gold-500/55 font-mono">
          <Lock size={11} aria-hidden />
          <span>Image stays on your device</span>
          <span className="text-gold-500/25">·</span>
          <span>Not a diagnosis — confirmed in-clinic</span>
        </div>
      </Container>
    </section>
  );
}

function IdleState({ onFile }: { onFile: (f: File) => void }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-[60%_40%] gap-10 items-center">
      <div className="aspect-[4/5] bg-surface-charcoal ring-1 ring-gold-500/30 overflow-hidden">
        <CartographyAtlas seed={42} zones={11} skin="III" preview />
      </div>
      <div>
        <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-gold-500/70 mb-4">Begin</p>
        <h3 className="font-display italic text-3xl md:text-4xl text-ivory-50 leading-tight">
          Compose your map.
        </h3>
        <p className="mt-4 text-ivory-50/65 leading-relaxed text-sm md:text-base">
          A well-lit, forward-facing selfie works best. Analysis runs entirely in your browser — nothing is uploaded.
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
              JPG · PNG · ≤8MB
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
      </div>
    </div>
  );
}

function PreviewState({
  imgUrl, imgRef, onStart, onReset,
}: {
  imgUrl: string;
  imgRef: React.RefObject<HTMLImageElement | null>;
  onStart: () => void;
  onReset: () => void;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-[60%_40%] gap-10 items-start">
      <div className="hidden">
        <Image ref={imgRef as React.RefObject<HTMLImageElement>}
               src={imgUrl} alt="" width={1000} height={1000} unoptimized />
      </div>

      <div className="relative aspect-[4/5] bg-surface-charcoal ring-1 ring-gold-500/30 overflow-hidden">
        <CartographyAtlas seed={Math.floor(Math.random() * 1000)} zones={0} skin="III" />
      </div>

      <div>
        <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-gold-500/70">Ready</p>
        <h3 className="mt-3 font-display italic text-3xl md:text-4xl text-ivory-50 leading-tight">
          Selfie loaded.
        </h3>
        <p className="mt-4 text-ivory-50/65 leading-relaxed text-sm md:text-base">
          Your image is held in browser memory only. We&apos;ll render a non-identifying topographic atlas of pigment distribution.
        </p>

        <button
          type="button"
          onClick={onStart}
          className="mt-8 group flex items-center justify-between gap-4 w-full
                     bg-gold-500 text-ink-900 px-6 py-4 hover:bg-gold-400 transition-colors"
        >
          <span className="font-mono text-xs uppercase tracking-[0.24em] font-semibold">
            Compose atlas
          </span>
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] opacity-60">
            ~ 3 sec
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

function ScanningState({
  imgUrl, imgRef,
}: {
  imgUrl: string;
  imgRef: React.RefObject<HTMLImageElement | null>;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-[60%_40%] gap-10 items-start">
      <div className="hidden">
        <Image ref={imgRef as React.RefObject<HTMLImageElement>}
               src={imgUrl} alt="" width={1000} height={1000} unoptimized />
      </div>

      <div className="relative aspect-[4/5] bg-surface-charcoal ring-1 ring-gold-500/30 overflow-hidden">
        <CartographyAtlas seed={Math.floor(Math.random() * 1000)} zones={11} skin="III" scanning />
        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between
                        font-mono text-[10px] uppercase tracking-[0.22em] text-gold-500/80">
          <span>Composing atlas…</span>
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
          Sampling melanin density across five facial regions. This takes about three seconds.
        </p>
      </div>
    </div>
  );
}

function RevealedState({
  scan, onReset,
}: { scan: ScanResult; onReset: () => void }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-[55%_45%] gap-10 items-start">
      <div className="relative aspect-[4/5] bg-surface-charcoal ring-1 ring-gold-500/50 overflow-hidden">
        <CartographyAtlas seed={123} zones={scan.zones} skin={scan.fitzpatrick} />
      </div>

      <div className="md:pt-6">
        <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-gold-500/70">Your atlas</p>
        <h3 className="mt-3 font-display italic text-3xl md:text-4xl text-ivory-50 leading-tight">
          {protocolFor(scan.fitzpatrick)}
        </h3>

        <dl className="mt-8 space-y-3 font-mono text-xs uppercase tracking-[0.22em]">
          <DataRow k="Zones identified" v={scan.zones.toString().padStart(2, "0")} />
          <DataRow k="Skin type"        v={`Fitzpatrick ${scan.fitzpatrick}`} />
          <DataRow k="Estimated plan"   v={sessionsFor(scan.zones)} />
        </dl>

        <p className="mt-8 text-ivory-50/60 text-sm leading-relaxed">
          For visualisation only — not a diagnosis. Final assessment confirmed by Dr. Ahmad in clinic.
        </p>

        <div className="mt-6 flex flex-col sm:flex-row gap-3">
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

function DataRow({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-gold-500/15 pb-2">
      <dt className="text-ivory-50/45">{k}</dt>
      <dd className="text-ivory-50 text-right">{v}</dd>
    </div>
  );
}
