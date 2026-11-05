import type { Metadata } from "next";
import localFont from "next/font/local";
import Script from "next/script";
import { siteConfig } from "@/lib/site-config";
import "./globals.css";

// Polices auto-hébergées (variables, sous-ensemble latin, OFL — via Fontsource) :
// next/font/google plante au build sur Vercel avec Turbopack
// (« next/font/google queries have exactly one entry »).
const inter = localFont({
  src: "./fonts/inter-latin.woff2",
  variable: "--font-inter",
  weight: "100 900",
  display: "swap",
});

const cormorant = localFont({
  src: "./fonts/cormorant-garamond-latin.woff2",
  variable: "--font-cormorant",
  weight: "300 700",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: "Nathalie OHL Réflexologue — Réflexologie à Altkirch",
    template: "%s — Nathalie OHL Réflexologue",
  },
  description:
    "Réflexologie plantaire, palmaire et crânio-faciale à Altkirch, près de Mulhouse. Praticienne certifiée E.R.V.E. Prenez rendez-vous en ligne.",
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      data-scroll-behavior="smooth"
      className={`${inter.variable} ${cormorant.variable} h-full antialiased`}
    >
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-C7DE8ZS25S"
          strategy="afterInteractive"
        />
        <Script id="ga4-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-C7DE8ZS25S');
          `}
        </Script>
      </head>
      <body className="flex min-h-full flex-col bg-cream text-stone-800">
        {children}
      </body>
    </html>
  );
}
