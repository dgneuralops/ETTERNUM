import type { Metadata, Viewport } from "next";
import { EB_Garamond, Inter } from "next/font/google";
import { LocaleProvider } from "@/lib/i18n/client";
import { getI18n } from "@/lib/i18n/server";
import "./globals.css";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
const garamond = EB_Garamond({
  variable: "--font-serif-display",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n();
  return {
    title: { default: t.meta.siteTitle, template: "%s · Etternum" },
    description: t.meta.siteDescription,
    applicationName: "Etternum",
  };
}

export const viewport: Viewport = {
  themeColor: "#0a0a0b",
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { locale } = await getI18n();
  return (
    <html lang={locale} className={`${inter.variable} ${garamond.variable} h-full antialiased`}>
      <body className="min-h-full">
        <LocaleProvider locale={locale}>{children}</LocaleProvider>
      </body>
    </html>
  );
}
