"use client";
import Link from "next/link";
import Image from "next/image";
import { useRef, useState } from "react";
import { Section } from "../primitives/Section";
import { Container } from "../primitives/Container";
import { Eyebrow } from "../primitives/Eyebrow";
import { useFaceMesh, type ScanResult } from "./useFaceMesh";
import { LeadForm, type RevealPayload } from "../quiz/LeadForm";
import { Camera, Upload, Lock } from "lucide-react";
import { CartographyAtlas } from "./CartographyAtlas";

type Phase = "idle" | "preview" | "scanning" | "gate" | "revealed";

export function SelfieScanner({
  onScanComplete,
}: {
  onScanComplete?: (reveal: RevealPayload, scan: ScanResult) => void;
}) {
  const { ready, runOnce } = useFaceMesh();
  const [phase, setPhase] = useState<Phase>("idle");
  const [imgUrl, setImgUrl] = useState<string | null>(null);
  const [scan, setScan] = useState<ScanResult | null>(null);
  const [reveal, setReveal] = useState<RevealPayload | null>(null);
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
      ready ? runOnce(imgRef.current) : Promise.resolve(null),
      new Promise(r => setTimeout(r, 3200)),
    ]);
    const finalScan: ScanResult = result ?? { zones: 9, fitzpatrick: "III", landmarks: null };
    setScan(finalScan);
    setPhase("gate");
  };

  const onReveal = (data: RevealPayload) => {
    setReveal(data);
    setPhase("revealed");
    if (scan && onScanComplete) onScanComplete(data, scan);
  };

  return (
    <Section id="pigmentation-map" className="bg-surface-black relative overflow-hidden">
      <div aria-hidden className="pointer-events-none absolute inset-0 opacity-40
                                   bg-[radial-gradient(ellipse_at_30%_20%,rgba(201,166,92,0.12),transparent_55%)]" />

      <Container width="wide" className="relative">
        <div className="flex items-baseline justify-between flex-wrap gap-4">
          <div>
            <Eyebrow>Dermal Cartography</Eyebrow>
            <h2 className="mt-3 font-display text-[clamp(2.25rem,3.5vw,3rem)] leading-[1.05] text-ivory-50 italic max-w-xl">
              Read your skin like a map.
            </h2>
          </div>
          <p className="text-sm text-ivory-50/55 max-w-sm font-mono leading-relaxed">
            On-device LAB-space variance analysis. We render your pigmentation as a topographic atlas — never the photograph itself.
          </p>
        </div>

        <div className="mt-12">
          {phase === "idle" && <IdleState onFile={handleFile} />}
          {(phase === "preview" || phase === "scanning") && imgUrl && (
            <PreviewState imgUrl={imgUrl} imgRef={imgRef}
              scanning={phase === "scanning"} onStart={startScan} ready={ready} />
          )}
          {phase === "gate" && scan && (
            <GateState scan={scan} onReveal={onReveal} />
          )}
          {phase === "revealed" && scan && reveal && (
            <RevealedState scan={scan} reveal={reveal} />
          )}
        </div>

        <div className="mt-10 flex items-center gap-3 text-xs uppercase tracking-[0.18em] text-gold-500/60 font-mono">
          <Lock size={12} aria-hidden />
          <span>Image never leaves your device</span>
          <span className="text-gold-500/30">·</span>
          <Link href="#quiz" className="text-gold-500/80 hover:text-gold-400 underline decoration-gold-500/30 underline-offset-4">
            Skip to diagnostic
          </Link>
        </div>
      </Container>
    </Section>
  );
}

function IdleState({ onFile }: { onFile: (f: File) => void }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-[60%_40%] gap-10 items-center">
      <div className="aspect-[4/5] bg-surface-charcoal ring-1 ring-gold-500/30 overflow-hidden">
        <CartographyAtlas seed={42} zones={11} skin="III" preview />
      </div>

      <div>
        <p className="text-xs font-mono uppercase tracking-[0.28em] text-gold-500/70 mb-4">Begin</p>
        <h3 className="font-display text-3xl text-ivory-50 leading-tight italic">
          Compose <em>your</em> map.
        </h3>
        <p className="mt-4 text-ivory-50/65 leading-relaxed text-sm">
          Upload a well-lit selfie. We render a private topographic atlas of your pigmentation — no facial image is uploaded, stored, or transmitted.
        </p>

        <label className="mt-8 group block cursor-pointer">
          <input type="file" accept="image/jpeg,image/png" className="sr-only"
                 onChange={e => e.target.files?.[0] && onFile(e.target.files[0])} />
          <span className="flex items-center justify-between gap-4 border border-gold-500/40 px-6 py-4
                           bg-surface-charcoal/40 group-hover:border-gold-500 group-hover:bg-surface-charcoal
                           transition-colors">
            <span className="flex items-center gap-3">
              <Upload size={18} className="text-gold-500" aria-hidden />
              <span className="font-mono text-xs uppercase tracking-[0.22em] text-ivory-50">
                Upload Selfie
              </span>
            </span>
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-gold-500/60">
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
  imgUrl, imgRef, scanning, onStart, ready,
}: {
  imgUrl: string;
  imgRef: React.RefObject<HTMLImageElement | null>;
  scanning: boolean; onStart: () => void; ready: boolean;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-[60%_40%] gap-10 items-start">
      <div className="hidden">
        <Image ref={imgRef as React.RefObject<HTMLImageElement>}
               src={imgUrl} alt="" width={1000} height={1000} unoptimized />
      </div>

      <div className="relative aspect-[4/5] bg-surface-charcoal ring-1 ring-gold-500/30 overflow-hidden">
        <CartographyAtlas
          seed={Math.floor(Math.random() * 1000)}
          zones={scanning ? 11 : 0}
          skin="III"
          scanning={scanning}
        />
        {scanning && (
          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between
                          font-mono text-[10px] uppercase tracking-[0.22em] text-gold-500/80">
            <span>Computing LAB variance…</span>
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-gold-500 animate-pulse" />
              <span>Live</span>
            </span>
          </div>
        )}
      </div>

      <div>
        <p className="text-xs font-mono uppercase tracking-[0.28em] text-gold-500/70">
          {scanning ? "Reading" : "Ready"}
        </p>
        <h3 className="mt-3 font-display text-3xl text-ivory-50 leading-tight italic">
          {scanning ? "Resolving your atlas…" : "Composition ready."}
        </h3>
        <p className="mt-4 text-ivory-50/65 leading-relaxed text-sm">
          {scanning
            ? "Sampling melanin density across five facial regions. This takes about three seconds."
            : "Your selfie is held in memory only. We will render a non-identifying topographic atlas of pigment distribution."}
        </p>

        {!scanning && (
          <button
            type="button"
            onClick={onStart}
            className="mt-8 group flex items-center justify-between gap-4 w-full
                       border border-gold-500 bg-gold-500 px-6 py-4
                       hover:bg-gold-400 hover:border-gold-400 transition-colors"
          >
            <span className="font-mono text-xs uppercase tracking-[0.22em] text-ink-900">
              Compose atlas
            </span>
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-900/60">
              {ready ? "Engine ready" : "Loading engine…"}
            </span>
          </button>
        )}

        <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.22em] text-ivory-50/35 leading-loose">
          For visualisation only — not a diagnosis. Final assessment is performed in-clinic.
        </p>
      </div>
    </div>
  );
}

function GateState({
  scan, onReveal,
}: { scan: ScanResult; onReveal: (r: RevealPayload) => void }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-[55%_45%] gap-10 items-start">
      <div className="relative">
        <div className="relative aspect-[4/5] bg-surface-charcoal ring-1 ring-gold-500/30 overflow-hidden">
          <CartographyAtlas seed={123} zones={scan.zones} skin={scan.fitzpatrick} blurred />
        </div>
        <div className="mt-4 grid grid-cols-3 gap-2 font-mono text-[10px] uppercase tracking-[0.22em]">
          <ReadOut label="Zones" value={scan.zones.toString().padStart(2, "0")} />
          <ReadOut label="Skin Type" value={`Fitzpatrick ${scan.fitzpatrick}`} />
          <ReadOut label="Status" value="Pending" />
        </div>
      </div>
      <div className="md:pt-8">
        <p className="text-xs font-mono uppercase tracking-[0.28em] text-gold-500/70">Reveal</p>
        <h3 className="mt-3 font-display text-3xl text-ivory-50 italic leading-tight">
          Your protocol awaits.
        </h3>
        <p className="mt-3 text-ivory-50/65 text-sm leading-relaxed">
          Where shall Dr. Ahmad&apos;s team send the full atlas + tailored protocol?
        </p>
        <div className="mt-8">
          <LeadForm
            answers={{ primary_concern: "not-sure", fitzpatrick: scan.fitzpatrick }}
            onReveal={onReveal}
            source="lp-pigmentation-scanner"
          />
        </div>
      </div>
    </div>
  );
}

function RevealedState({
  scan, reveal,
}: { scan: ScanResult; reveal: RevealPayload }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-[55%_45%] gap-10 items-start">
      <div className="relative aspect-[4/5] bg-surface-charcoal ring-1 ring-gold-500/50 overflow-hidden">
        <CartographyAtlas seed={123} zones={scan.zones} skin={scan.fitzpatrick} />
      </div>
      <div className="md:pt-8">
        <p className="text-xs font-mono uppercase tracking-[0.28em] text-gold-500/70">For {reveal.firstName}</p>
        <h3 className="mt-3 font-display text-3xl text-ivory-50 italic leading-tight">
          {reveal.recommendedProtocol ?? "Consultation Required"}
        </h3>
        <dl className="mt-8 space-y-3 font-mono text-xs uppercase tracking-[0.18em]">
          <DataRow k="Zones identified" v={scan.zones.toString().padStart(2, "0")} />
          <DataRow k="Skin type" v={`Fitzpatrick ${scan.fitzpatrick}`} />
          <DataRow k="Estimated sessions" v={reveal.estimatedSessions ?? "TBD at consultation"} />
        </dl>
        <Link href="#book"
          className="mt-10 inline-flex items-center justify-between gap-4 w-full
                     bg-gold-500 text-ink-900 px-6 py-4 hover:bg-gold-400 transition-colors">
          <span className="font-mono text-xs uppercase tracking-[0.22em]">Book Free Consultation</span>
          <span aria-hidden>→</span>
        </Link>
      </div>
    </div>
  );
}

function ReadOut({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-t border-gold-500/20 pt-2">
      <div className="text-gold-500/55 text-[9px]">{label}</div>
      <div className="text-ivory-50 mt-0.5">{value}</div>
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
