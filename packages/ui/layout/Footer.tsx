import Link from "next/link";
import { Container } from "../primitives/Container";

export function Footer() {
  return (
    <footer className="bg-surface-900 text-surface-50">
      <Container width="wide" className="py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-8">
          <div className="md:col-span-2">
            <div className="flex items-baseline gap-2">
              <span className="font-display text-2xl">Harley Street</span>
              <span className="text-xs uppercase tracking-[0.18em] text-clay-300">Aesthetics</span>
            </div>
            <p className="mt-4 text-surface-50/70 max-w-md leading-relaxed">
              Doctor-led pigmentation, peel, and skin-glow clinic — Glasgow. Calibrated to every Fitzpatrick type.
            </p>
            <Link href="#book"
              className="mt-6 inline-flex items-center bg-clay-500 text-surface-50 px-5 py-3
                         text-[12px] uppercase tracking-[0.12em] font-semibold rounded-full
                         hover:bg-clay-600 transition-colors">
              Book free consultation →
            </Link>
          </div>

          <div className="text-sm">
            <p className="uppercase tracking-[0.18em] text-clay-300 mb-4 text-xs font-semibold">Visit</p>
            <p className="text-surface-50/80 leading-relaxed">
              154 Clyde St<br/>
              Glasgow G1 4EX<br/>
              United Kingdom
            </p>
            <p className="mt-4 text-surface-50/80">
              <span className="block">0141-XXX-XXXX</span>
              <span className="block">Mon–Sat · 9am–7pm</span>
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
          <p>GMC registered · CQC inspected</p>
        </div>
      </Container>
    </footer>
  );
}
