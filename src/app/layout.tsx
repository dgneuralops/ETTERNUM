import type { Metadata, Viewport } from "next";
import { EB_Garamond, Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
const garamond = EB_Garamond({
  variable: "--font-serif-display",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: { default: "Etternum — Converse com grandes mentes", template: "%s · Etternum" },
  description:
    "Seu amigo pessoal eterno: converse com grandes mentes da humanidade — filósofos, psicólogos, teólogos, historiadores e empresários — sobre todas as áreas da sua vida.",
  applicationName: "Etternum",
};

export const viewport: Viewport = {
  themeColor: "#0a0a0b",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${garamond.variable} h-full antialiased`}>
      <body className="min-h-full">{children}</body>
    </html>
  );
}
