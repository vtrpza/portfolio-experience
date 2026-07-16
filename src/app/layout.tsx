import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

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
  title: {
    default: "Vitor Pouza — Engenharia Full-Stack e Segurança",
    template: "%s — Vitor Pouza",
  },
  description:
    "Portfólio de Vitor Pouza: produtos full-stack, plataformas SaaS, integrações de IA e segurança aplicada.",
  keywords: [
    "engenheiro full-stack",
    "React",
    "Next.js",
    "TypeScript",
    "Node.js",
    "SaaS",
    "segurança de aplicações",
  ],
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
