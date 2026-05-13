import "./globals.css";
import { Spectral, Manrope, DM_Mono } from "next/font/google";

const spectral = Spectral({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const dmMono = DM_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500"],
  display: "swap",
});

export const metadata = { title: "Harley Street Aesthetics — Glasgow" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB" className={`${spectral.variable} ${manrope.variable} ${dmMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
