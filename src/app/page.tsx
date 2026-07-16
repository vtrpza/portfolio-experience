import type { Metadata } from "next";
import { ExperienceShell } from "@/components/experience-shell";
import { Observatory } from "@/components/observatory";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function Home() {
  return <ExperienceShell scene={<Observatory />} />;
}
