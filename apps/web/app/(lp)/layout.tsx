import { NavBar } from "@ui/layout/NavBar";
import { Footer } from "@ui/layout/Footer";
import { StickyMobileCTA } from "@ui/sections/StickyMobileCTA";

export default function LpLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <NavBar />
      <main>{children}</main>
      <StickyMobileCTA label="Take Skin Quiz →" href="#quiz" />
      <Footer />
    </>
  );
}
