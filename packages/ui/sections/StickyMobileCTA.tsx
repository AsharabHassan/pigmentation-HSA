"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

export function StickyMobileCTA({ label, href }: { label: string; href: string }) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 600);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      data-testid="sticky-mobile-cta"
      className={`fixed bottom-0 left-0 right-0 z-50 md:hidden
                  border-t border-ink-300/40 bg-ivory-50/95 backdrop-blur-md
                  px-4 py-3 transition-opacity duration-300 ${show ? "opacity-100" : "opacity-0 pointer-events-none"}`}
    >
      <Link
        href={href as never}
        className="block w-full text-center bg-ink-900 text-ivory-50 px-5 py-3.5
                   text-sm uppercase tracking-wider"
      >
        {label}
      </Link>
    </div>
  );
}
