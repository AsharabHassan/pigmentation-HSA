"use client";
import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Container } from "../primitives/Container";

export function NavBar() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 bg-surface-50/85 backdrop-blur-md border-b border-surface-200">
      <Container width="wide" className="flex items-center justify-between py-4 md:py-5">
        <Link href="/" className="flex items-baseline gap-2 text-ink-900">
          <span className="font-display text-xl md:text-2xl">Harley Street</span>
          <span className="font-body text-xs md:text-sm uppercase tracking-[0.18em] text-clay-500">Aesthetics</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm text-ink-700">
          <Link href="#treatments" className="hover:text-clay-500 transition-colors">Treatments</Link>
          <Link href="#pigmentation-map" className="hover:text-clay-500 transition-colors">AI Skin Scan</Link>
          <Link href="#doctor" className="hover:text-clay-500 transition-colors">Dr. Ahmad</Link>
          <Link href="#pricing" className="hover:text-clay-500 transition-colors">Pricing</Link>
          <Link href="#book"
            className="bg-clay-500 text-surface-50 px-5 py-2.5 text-[12px] uppercase tracking-[0.1em] font-semibold
                       hover:bg-clay-600 transition-colors rounded-full">
            Book free consult
          </Link>
        </nav>

        <button
          type="button"
          onClick={() => setOpen(v => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          className="md:hidden -mr-2 p-2 text-ink-900"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </Container>

      {open && (
        <div className="md:hidden border-t border-surface-200 bg-surface-50">
          <Container width="wide" className="py-6 flex flex-col gap-1 text-base">
            <Link href="#treatments" onClick={() => setOpen(false)}
                  className="py-3 text-ink-700 hover:text-clay-500 transition-colors">Treatments</Link>
            <Link href="#pigmentation-map" onClick={() => setOpen(false)}
                  className="py-3 text-ink-700 hover:text-clay-500 transition-colors">AI Skin Scan</Link>
            <Link href="#doctor" onClick={() => setOpen(false)}
                  className="py-3 text-ink-700 hover:text-clay-500 transition-colors">Dr. Ahmad</Link>
            <Link href="#pricing" onClick={() => setOpen(false)}
                  className="py-3 text-ink-700 hover:text-clay-500 transition-colors">Pricing</Link>
            <Link href="#faq" onClick={() => setOpen(false)}
                  className="py-3 text-ink-700 hover:text-clay-500 transition-colors">FAQ</Link>
            <Link href="#book" onClick={() => setOpen(false)}
                  className="mt-3 inline-block text-center bg-clay-500 text-surface-50 px-5 py-3.5
                             text-[12px] uppercase tracking-[0.1em] font-semibold hover:bg-clay-600 transition-colors rounded-full">
              Book free consultation
            </Link>
          </Container>
        </div>
      )}
    </header>
  );
}
