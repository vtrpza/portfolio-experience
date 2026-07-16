import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  const isProduction = process.env.SITE_ENV === "production";

  return {
    rules: { userAgent: "*", ...(isProduction ? { allow: "/" } : { disallow: "/" }) },
    ...(isProduction ? { sitemap: "https://vitorpouza.dev/sitemap.xml" } : {}),
  };
}
