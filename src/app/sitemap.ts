import type { MetadataRoute } from "next";
import { loadArticles } from "@/lib/articles";

const siteUrl = "https://vitorpouza.dev";
const staticRoutes = ["", "/about", "/case-studies", "/playground", "/uses", "/artigos", "/politica-editorial"];

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
    url: `${siteUrl}${route}/`,
  }));

  for (const article of loadArticles()) {
    entries.push({
      url: `${siteUrl}/artigos/${article.slug}/`,
      lastModified: article.updatedAt,
    });
  }

  return entries;
}
