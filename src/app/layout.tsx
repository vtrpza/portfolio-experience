import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const siteUrl = "https://vitorpouza.dev";
const isProduction = process.env.SITE_ENV === "production";
const siteTitle = "Vitor Pouza — Engenharia Full-Stack e Segurança";
const siteDescription =
  "Portfólio de Vitor Pouza: produtos full-stack, plataformas SaaS, integrações de IA e segurança aplicada.";
const socialDescription =
  "Produtos full-stack, plataformas SaaS, integrações de IA e segurança aplicada.";

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
    description: socialDescription,
    url: siteUrl,
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Vitor Pouza — Produtos full-stack confiáveis, do problema à produção.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: socialDescription,
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
