import type { Metadata } from "next";
import { ExperienceShell } from "@/components/experience-shell";
import { loadArticles } from "@/lib/articles";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function Home() {
  return <ExperienceShell latestArticle={loadArticles()[0]} />;
}
