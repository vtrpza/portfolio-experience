import type { Metadata } from "next";
import { ExperienceShell } from "@/components/experience-shell";
import { Observatory } from "@/components/observatory";
import { loadArticles } from "@/lib/articles";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function Home() {
  return <ExperienceShell scene={<Observatory />} latestArticle={loadArticles()[0]} />;
}
