import Link from "next/link";
import { Container } from "../primitives/Container";

export function Footer() {
  return (
    <footer className="bg-surface-charcoal text-ivory-50/85 mt-32 border-t border-gold-500/20">
      <Container width="wide" className="py-16 grid md:grid-cols-3 gap-10">
        <div>
          <p className="font-display text-2xl mb-3 text-ivory-50">
            Harley Street <span className="text-gold-500">Aesthetics</span>
          </p>
          <p className="text-sm leading-relaxed text-ivory-50/60">
            154 Clyde St<br/>Glasgow G1 4EX<br/>United Kingdom
          </p>
        </div>
        <div className="text-sm">
          <p className="uppercase tracking-[0.18em] text-gold-500 mb-3 text-xs">Contact</p>
          <p>Phone: 0141-XXX-XXXX</p>
          <p>Hours: Mon–Sat, 9am–7pm</p>
        </div>
        <div className="text-sm">
          <p className="uppercase tracking-[0.18em] text-gold-500 mb-3 text-xs">Legal</p>
          <Link href="/privacy" className="block hover:text-gold-400">Privacy Policy</Link>
          <Link href="/terms" className="block hover:text-gold-400">Terms</Link>
          <Link href="/complaints" className="block hover:text-gold-400">Complaints</Link>
        </div>
      </Container>
      <div className="border-t border-gold-500/10 py-5 text-center text-xs text-ivory-50/40">
        © 2026 Harley Street Aesthetics — All rights reserved
      </div>
    </footer>
  );
}
