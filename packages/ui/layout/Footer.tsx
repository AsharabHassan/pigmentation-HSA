import Link from "next/link";
import { Container } from "../primitives/Container";

export function Footer() {
  return (
    <footer className="bg-aubergine-900 text-ivory-100 mt-32">
      <Container width="wide" className="py-16 grid md:grid-cols-3 gap-10">
        <div>
          <p className="font-display text-2xl mb-3">Harley Street Medics</p>
          <p className="text-sm leading-relaxed text-ivory-100/80">
            154 Clyde St<br/>Glasgow G1 4EX<br/>United Kingdom
          </p>
        </div>
        <div className="text-sm">
          <p className="uppercase tracking-wider text-gold-500 mb-3 text-xs">Contact</p>
          <p>Phone: 0141-XXX-XXXX</p>
          <p>Hours: Mon–Sat, 9am–7pm</p>
        </div>
        <div className="text-sm">
          <p className="uppercase tracking-wider text-gold-500 mb-3 text-xs">Legal</p>
          <Link href="/privacy" className="block hover:text-gold-400">Privacy Policy</Link>
          <Link href="/terms" className="block hover:text-gold-400">Terms</Link>
          <Link href="/complaints" className="block hover:text-gold-400">Complaints</Link>
        </div>
      </Container>
      <div className="border-t border-ivory-100/10 py-5 text-center text-xs text-ivory-100/60">
        © 2026 Harley Street Medics — All rights reserved
      </div>
    </footer>
  );
}
