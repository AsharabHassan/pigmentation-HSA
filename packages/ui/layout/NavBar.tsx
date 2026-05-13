import Link from "next/link";
import { Container } from "../primitives/Container";

export function NavBar() {
  return (
    <header className="sticky top-0 z-40 bg-ivory-50/85 backdrop-blur-md border-b border-ink-300/30">
      <Container width="wide" className="flex items-center justify-between py-5">
        <Link href="/" className="font-display text-xl tracking-tight text-ink-900">
          Harley Street Medics
        </Link>
        <nav className="hidden md:flex items-center gap-10 text-sm text-ink-700">
          <Link href="#treatments" className="hover:text-aubergine-900 transition-colors">Treatments</Link>
          <Link href="#doctor" className="hover:text-aubergine-900 transition-colors">The Doctor</Link>
          <Link href="#book"
            className="bg-ink-900 text-ivory-50 px-5 py-2.5 text-xs uppercase tracking-wider
                       hover:bg-aubergine-900 transition-colors">
            Book Now ▸
          </Link>
        </nav>
      </Container>
    </header>
  );
}
