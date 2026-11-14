import type { Metadata } from "next";
import { Archivo, B612_Mono } from "next/font/google";
import "./globals.css";

// Archivo is a grotesque built for headlines at very large sizes; B612 Mono was
// drawn for aircraft cockpit displays and sets the small labels and readouts.
const archivo = Archivo({
  variable: "--font-sans",
  subsets: ["latin"],
  axes: ["wdth"],
});

const b612Mono = B612_Mono({
  variable: "--font-b612-mono",
  subsets: ["latin"],
  weight: ["400"],
});

export const metadata: Metadata = {
  title: "Question Board: fire safety answers from NASA microgravity combustion data",
  description:
    "24 NASA combustion investigations, ranked against the fire-safety questions that matter for spacecraft, stations and Moon bases. Every answer shows the NASA text behind it.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${archivo.variable} ${b612Mono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-canvas text-ink">{children}</body>
    </html>
  );
}
