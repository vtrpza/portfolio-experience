import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const siteUrl = "https://vitorpouza.dev";
const isProduction = process.env.SITE_ENV === "production";
const siteTitle = "Vitor Pouza — Produtos da decisão à produção";
const siteDescription =
  "Engenharia full-stack para fundadores e líderes de produto: sistemas, integrações e segurança da decisão à produção.";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteTitle,
    template: "%s — Vitor Pouza",
  },
  description: siteDescription,
  keywords: [
    "engenheiro full-stack",
    "React",
    "Next.js",
    "TypeScript",
    "Node.js",
    "SaaS",
    "segurança de aplicações",
  ],
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: "Vitor Pouza",
    title: siteTitle,
    description: siteDescription,
    url: siteUrl,
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Vitor Pouza — produtos confiáveis da decisão à produção",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
    images: ["/og.png"],
  },
  robots: { index: isProduction, follow: isProduction },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
