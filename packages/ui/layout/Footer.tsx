import Link from "next/link";
import { Container } from "../primitives/Container";
import { clinics, contactEmail } from "@content/clinics";

export function Footer() {
  return (
    <footer className="bg-surface-900 text-surface-50">
      <Container width="wide" className="py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 md:gap-8">
          <div className="md:col-span-2">
            <div className="flex items-baseline gap-2">
              <span className="font-display text-2xl">Harley Street</span>
              <span className="text-xs uppercase tracking-[0.18em] text-clay-300">Aesthetics</span>
            </div>
            <p className="mt-4 text-surface-50/70 max-w-md leading-relaxed">
              Doctor-led pigmentation, peel, and skin-glow clinic — Glasgow & London. Calibrated to every Fitzpatrick type.
            </p>
            <p className="mt-4 text-sm text-surface-50/80">
              <a href={`mailto:${contactEmail}`} className="hover:text-clay-300 transition-colors">
                {contactEmail}
              </a>
            </p>
            <Link href="#book"
              className="mt-6 inline-flex items-center bg-clay-500 text-ink-900 px-5 py-3
                         text-[12px] uppercase tracking-[0.12em] font-semibold rounded-full
                         hover:bg-clay-600 transition-colors">
              Book free consultation →
            </Link>
          </div>

          <div className="text-sm">
            <p className="uppercase tracking-[0.18em] text-clay-300 mb-4 text-xs font-semibold">London</p>
            <p className="text-surface-50/80 leading-relaxed">
              {clinics.london.addressLines.map((line, i) => (
                <span key={i} className="block">{line}</span>
              ))}
              <span className="block">{clinics.london.postcode}</span>
            </p>
            <p className="mt-4 text-surface-50/80">
              <a href={`tel:${clinics.london.phoneE164}`} className="block hover:text-clay-300 transition-colors">
                {clinics.london.phoneDisplay}
              </a>
              <span className="block">{clinics.london.hours}</span>
            </p>
          </div>

          <div className="text-sm">
            <p className="uppercase tracking-[0.18em] text-clay-300 mb-4 text-xs font-semibold">Glasgow</p>
            <p className="text-surface-50/80 leading-relaxed">
              {clinics.glasgow.addressLines.map((line, i) => (
                <span key={i} className="block">{line}</span>
              ))}
              <span className="block">{clinics.glasgow.postcode}</span>
            </p>
            <p className="mt-4 text-surface-50/80">
              <a href={`tel:${clinics.glasgow.phoneE164}`} className="block hover:text-clay-300 transition-colors">
                {clinics.glasgow.phoneDisplay}
              </a>
              <span className="block">{clinics.glasgow.hours}</span>
            </p>
          </div>

          <div className="text-sm">
            <p className="uppercase tracking-[0.18em] text-clay-300 mb-4 text-xs font-semibold">Legal</p>
            <ul className="space-y-2 text-surface-50/80">
              <li><Link href="/privacy" className="hover:text-clay-300 transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-clay-300 transition-colors">Terms of Service</Link></li>
              <li><Link href="/complaints" className="hover:text-clay-300 transition-colors">Complaints procedure</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-surface-50/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-3 text-xs text-surface-50/50">
          <p>© 2026 Harley Street Aesthetics · All rights reserved</p>
          <p>Doctor-led aesthetic medicine</p>
        </div>
      </Container>
    </footer>
  );
}
