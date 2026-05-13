"use client";
import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Container } from "../primitives/Container";

/**
 * Mobile-first nav.
 * - Phone: logo left, hamburger right, slide-down panel
 * - Desktop: full horizontal nav
 */
export function NavBar() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 bg-surface-black/90 backdrop-blur-md border-b border-gold-500/15">
      <Container width="wide" className="flex items-center justify-between py-4 md:py-5">
        <Link href="/" className="font-display italic text-xl md:text-2xl tracking-tight text-ivory-50">
          Harley Street <span className="text-gold-500 not-italic font-normal text-lg">·</span> <span className="text-gold-500">Aesthetics</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm text-ivory-50/75">
          <Link href="#treatments" className="hover:text-gold-400 transition-colors">Treatments</Link>
          <Link href="#doctor" className="hover:text-gold-400 transition-colors">The Doctor</Link>
          <Link href="#book"
            className="bg-gold-500 text-ink-900 px-5 py-2.5 text-[11px] uppercase tracking-[0.18em] font-semibold
                       hover:bg-gold-400 transition-colors">
            Book Now ▸
          </Link>
        </nav>

        <button
          type="button"
          onClick={() => setOpen(v => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          className="md:hidden -mr-2 p-2 text-ivory-50"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </Container>

      {open && (
        <div className="md:hidden border-t border-gold-500/15 bg-surface-black">
          <Container width="wide" className="py-6 flex flex-col gap-1 text-base">
            <Link href="#treatments" onClick={() => setOpen(false)}
                  className="py-3 text-ivory-50/85 hover:text-gold-400 transition-colors">Treatments</Link>
            <Link href="#doctor" onClick={() => setOpen(false)}
                  className="py-3 text-ivory-50/85 hover:text-gold-400 transition-colors">The Doctor</Link>
            <Link href="#pigmentation-map" onClick={() => setOpen(false)}
                  className="py-3 text-ivory-50/85 hover:text-gold-400 transition-colors">AI Skin Analysis</Link>
            <Link href="#faq" onClick={() => setOpen(false)}
                  className="py-3 text-ivory-50/85 hover:text-gold-400 transition-colors">FAQ</Link>
            <Link href="#book" onClick={() => setOpen(false)}
                  className="mt-3 inline-block text-center bg-gold-500 text-ink-900 px-5 py-3.5
                             text-[12px] uppercase tracking-[0.18em] font-semibold hover:bg-gold-400 transition-colors">
              Book Now ▸
            </Link>
          </Container>
        </div>
      )}
    </header>
  );
}
