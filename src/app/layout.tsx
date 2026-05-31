import type { Metadata, Viewport } from "next";
import { Cinzel, Amiri, Cairo } from "next/font/google";
import { weddingConfig } from "@/config/wedding";
import "./globals.css";

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const amiri = Amiri({
  variable: "--font-amiri",
  subsets: ["arabic"],
  weight: ["400", "700"],
  display: "swap",
});

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic"],
  weight: ["300", "400", "600", "700"],
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://wedding-invite-demo.com"),
  title: weddingConfig.seo.title,
  description: weddingConfig.seo.description,
  keywords: weddingConfig.seo.keywords,
  authors: [{ name: "Antigravity SaaS" }],
  openGraph: {
    title: weddingConfig.seo.title,
    description: weddingConfig.seo.description,
    type: "website",
    locale: "ar_EG",
    images: [
      {
        url: weddingConfig.seo.ogImage,
        width: 1200,
        height: 630,
        alt: weddingConfig.seo.title,
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ar"
      className={`${cinzel.variable} ${amiri.variable} ${cairo.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
