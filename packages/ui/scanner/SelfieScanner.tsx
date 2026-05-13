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
    if (!ready || !imgRef.current) return;
    setPhase("scanning");
    const [result] = await Promise.all([
      runOnce(imgRef.current),
      new Promise(r => setTimeout(r, 2500)),
    ]);
    if (result) setScan(result);
    setPhase("gate");
  };

  const onReveal = (data: RevealPayload) => {
    setReveal(data);
    setPhase("revealed");
    if (scan && onScanComplete) onScanComplete(data, scan);
  };

  return (
    <Section id="pigmentation-map" className="bg-ivory-100">
      <Container width="wide">
        <Eyebrow>Pigmentation map</Eyebrow>
        <h2 className="mt-3 font-display text-[clamp(2rem,3vw,2.75rem)] leading-tight text-ink-900">
          See your pigmentation. In 30 seconds.
        </h2>
        <p className="mt-3 text-ink-700 max-w-2xl">
          A visual indication of pigmentation patterns on your skin. Runs entirely on your device — your image never leaves it.
        </p>

        <div className="mt-10">
          {phase === "idle" && <IdleState onFile={handleFile} />}
          {(phase === "preview" || phase === "scanning") && imgUrl && (
            <PreviewState
              imgUrl={imgUrl} imgRef={imgRef}
              scanning={phase === "scanning"}
              onStart={startScan}
              ready={ready}
            />
          )}
          {phase === "gate" && imgUrl && scan && (
            <GateState imgUrl={imgUrl} scan={scan} onReveal={onReveal} />
          )}
          {phase === "revealed" && imgUrl && scan && reveal && (
            <RevealedState imgUrl={imgUrl} scan={scan} reveal={reveal} />
          )}
        </div>

        <div className="mt-8 flex items-center gap-2 text-sm text-ink-500">
          <Lock size={14} aria-hidden />
          <span>100% client-side · We never see your image · GDPR-compliant</span>
        </div>

        <p className="mt-2 text-sm text-ink-500">
          <Link href="#quiz" className="underline decoration-gold-500 underline-offset-4">
            Skip to quiz
          </Link>
        </p>
      </Container>
    </Section>
  );
}

function IdleState({ onFile }: { onFile: (f: File) => void }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <label className="border-2 border-dashed border-ink-300 hover:border-gold-500 transition-colors
                        p-12 flex flex-col items-center text-center cursor-pointer bg-ivory-50">
        <Upload size={28} className="text-ink-700" aria-hidden />
        <span className="mt-3 font-medium">Upload selfie</span>
        <span className="mt-1 text-sm text-ink-500">jpg / png, ≤ 8MB</span>
        <input
          type="file" accept="image/jpeg,image/png" className="sr-only"
          onChange={e => e.target.files?.[0] && onFile(e.target.files[0])}
        />
      </label>
      <div className="border-2 border-dashed border-ink-300 p-12 flex flex-col items-center text-center bg-ivory-50/50">
        <Camera size={28} className="text-ink-500" aria-hidden />
        <span className="mt-3 font-medium text-ink-500">Use webcam (coming soon)</span>
        <span className="mt-1 text-sm text-ink-500">Live capture</span>
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
    <div className="grid grid-cols-1 md:grid-cols-[60%_40%] gap-8 items-start">
      <div className="relative bg-ink-900 aspect-[4/5] overflow-hidden">
        <Image
          ref={imgRef as React.RefObject<HTMLImageElement>}
          src={imgUrl} alt="" fill unoptimized
          className="object-cover"
        />
        {scanning && <ScanOverlay />}
      </div>
      <div>
        <p className="text-sm uppercase tracking-wider text-ink-500">
          {scanning ? "Scanning your skin…" : "Photo ready"}
        </p>
        <h3 className="mt-2 font-display text-2xl text-ink-900">
          {scanning ? "Resolving face landmarks + pigment patterns…" : "Run the analysis"}
        </h3>
        {!scanning && (
          <button
            type="button"
            disabled={!ready}
            onClick={onStart}
            className="mt-6 bg-ink-900 text-ivory-50 px-7 py-3.5 text-sm uppercase tracking-wider
                       ring-1 ring-gold-500 ring-offset-4 ring-offset-ivory-100 hover:bg-aubergine-900
                       disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            {ready ? "Begin scan" : "Loading model…"}
          </button>
        )}
        <p className="mt-4 text-xs text-ink-500 max-w-xs">
          This tool is for visualisation only. A clinical assessment by Dr. Ahmad confirms your actual diagnosis and protocol.
        </p>
      </div>
    </div>
  );
}

function ScanOverlay() {
  return (
    <div className="absolute inset-0 pointer-events-none">
      <div className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-gold-500 to-transparent
                      animate-[scan-sweep_2.5s_ease-in-out_forwards]" />
      <div className="absolute inset-0 border border-gold-500/30" />
      <style>{`
        @keyframes scan-sweep {
          0%   { top: 0%; }
          100% { top: 100%; }
        }
      `}</style>
    </div>
  );
}

function GateState({
  imgUrl, scan, onReveal,
}: { imgUrl: string; scan: ScanResult; onReveal: (r: RevealPayload) => void }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-[40%_60%] gap-8">
      <div className="relative aspect-[4/5] overflow-hidden bg-ink-900">
        <Image src={imgUrl} alt="" fill unoptimized className="object-cover" />
      </div>
      <div className="relative">
        <div aria-hidden className="absolute inset-0 backdrop-blur-md bg-ivory-100/70 z-10
                                    flex items-center justify-center">
          <Lock size={32} className="text-aubergine-900" />
        </div>
        <div className="opacity-60 select-none pointer-events-none">
          <p className="uppercase tracking-wider text-xs text-gold-500">Your pigmentation map</p>
          <p className="mt-3">Zone density: {scan.zones} zones identified</p>
          <p>Skin type: Fitzpatrick {scan.fitzpatrick} (estimated)</p>
        </div>
        <div className="mt-8 relative z-20">
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
  imgUrl, scan, reveal,
}: { imgUrl: string; scan: ScanResult; reveal: RevealPayload }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-[40%_60%] gap-8">
      <div className="relative aspect-[4/5] overflow-hidden bg-ink-900">
        <Image src={imgUrl} alt="" fill unoptimized className="object-cover" />
      </div>
      <div>
        <p className="uppercase tracking-wider text-xs text-gold-500">Your pigmentation map</p>
        <h3 className="mt-2 font-display text-3xl text-ink-900">Hi {reveal.firstName}.</h3>
        <ul className="mt-6 space-y-2 text-ink-700">
          <li><strong>Zones identified:</strong> {scan.zones}</li>
          <li><strong>Skin type estimate:</strong> Fitzpatrick {scan.fitzpatrick}</li>
          <li><strong>Recommended protocol:</strong> {reveal.recommendedProtocol ?? "Consultation Required"}</li>
        </ul>
        <Link href="#book"
          className="mt-8 inline-block bg-ink-900 text-ivory-50 px-7 py-3.5 text-sm uppercase tracking-wider
                     ring-1 ring-gold-500 ring-offset-4 ring-offset-ivory-100 hover:bg-aubergine-900 transition-colors">
          Book Free Consultation
        </Link>
      </div>
    </div>
  );
}
