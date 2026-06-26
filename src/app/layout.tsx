import type { Metadata } from "next";
import { ServiceWorkerRegister } from "@/components/ServiceWorkerRegister";
import "./globals.css";

export const metadata: Metadata = {
  title: "Quranik — Listen to the Holy Quran Seamlessly",
  description:
    "Quranik by Islam Hafez is a modern web application for streaming the Holy Quran. Features gapless playback, 230+ reciters, robust Arabic search, and full PWA support.",
  keywords: [
    "Quran", "Al-Quran", "Islam", "Muslim",
    "Streaming", "Recitations", "Mushaf",
    "Holy Quran", "Quranik",
    "Islam Hafez", "islamhafez0",
    "Quran app", "Quran streaming",
    "القرآن الكريم", "تلاوات قرآنية",
  ],
  authors: [
    { name: "Islam Hafez", url: "https://islamhafez.vercel.app" },
  ],
  creator: "Islam Hafez",
  publisher: "Islam Hafez",
  openGraph: {
    type: "website",
    url: "https://quranik.vercel.app/",
    title: "Quranik — Listen to the Holy Quran Seamlessly",
    description:
      "A premium, gapless Quran streaming web app with 230+ reciters and robust Arabic search. Built by Islam Hafez.",
    images: [{ url: "https://quranik.vercel.app/brand.png" }],
    siteName: "Quranik",
  },
  twitter: {
    card: "summary_large_image",
    title: "Quranik — Listen to the Holy Quran Seamlessly",
    description:
      "A premium, gapless Quran streaming web app with 230+ reciters and robust Arabic search. Built by Islam Hafez.",
    images: ["https://quranik.vercel.app/brand.png"],
    creator: "@islamhafez0",
  },
  icons: {
    icon: "/pwa-192x192.png",
    apple: "/pwa-192x192.png",
  },
  manifest: "/manifest.json",
  other: {
    "google-site-verification": "wMRajd6GIGfqqddAS2oq-oJJj4tnsJ8b6RFlh8TpQ3k",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Amiri:wght@400;700&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              name: "Quranik",
              url: "https://quranik.vercel.app/",
              description:
                "Listen to the Holy Quran with a beautiful, modern interface featuring gapless playback and over 230 reciters.",
              applicationCategory: "Reference",
              genre: "Islamic",
              operatingSystem: "Web, Android, iOS",
              author: {
                "@type": "Person",
                name: "Islam Hafez",
                url: "https://islamhafez.vercel.app",
                sameAs: [
                  "https://github.com/islamhafez0",
                  "https://islamhafez.vercel.app",
                ],
              },
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "USD",
              },
            }),
          }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        {children}
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
