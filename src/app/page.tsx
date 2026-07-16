import { ExperienceShell } from "@/components/experience-shell";
import { Observatory } from "@/components/observatory";

export default function Home() {
  return <ExperienceShell scene={<Observatory />} />;
}
