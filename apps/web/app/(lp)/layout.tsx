import { AnnouncementRibbon } from "@ui/layout/AnnouncementRibbon";
import { NavBar } from "@ui/layout/NavBar";
import { Footer } from "@ui/layout/Footer";
import { StickyMobileCTA } from "@ui/sections/StickyMobileCTA";

export default function LpLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AnnouncementRibbon />
      <NavBar />
      <main>{children}</main>
      <StickyMobileCTA label="Book Free 10-min Consult →" href="#book" />
      <Footer />
    </>
  );
}
