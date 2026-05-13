import Link from "next/link";
import { Container } from "../primitives/Container";

export function NavBar() {
  return (
    <header className="sticky top-0 z-40 bg-surface-black/85 backdrop-blur-md border-b border-gold-500/15">
      <Container width="wide" className="flex items-center justify-between py-5">
        <Link href="/" className="font-display text-xl tracking-tight text-ivory-50">
          Harley Street <span className="text-gold-500">Aesthetics</span>
        </Link>
        <nav className="hidden md:flex items-center gap-10 text-sm text-ivory-50/75">
          <Link href="#treatments" className="hover:text-gold-400 transition-colors">Treatments</Link>
          <Link href="#doctor" className="hover:text-gold-400 transition-colors">The Doctor</Link>
          <Link href="#book"
            className="bg-gold-500 text-ink-900 px-5 py-2.5 text-xs uppercase tracking-[0.18em] font-medium
                       hover:bg-gold-400 transition-colors">
            Book Now ▸
          </Link>
        </nav>
      </Container>
    </header>
  );
}
