import { NavBar } from "@ui/layout/NavBar";
import { Footer } from "@ui/layout/Footer";

export default function FaqLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <NavBar />
      <main>{children}</main>
      <Footer />
    </>
  );
}
