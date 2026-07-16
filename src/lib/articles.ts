import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { type Article, validateArticle } from "../../editorial/article";

export function loadArticles(
  directory = join(process.cwd(), "content", "articles"),
): Article[] {
  let files: string[];

  try {
    files = readdirSync(directory, { withFileTypes: true })
      .filter((file) => file.isFile() && file.name.endsWith(".json"))
      .map((file) => file.name)
      .sort();
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw error;
  }

  const articles: Article[] = [];
  const slugs = new Set<string>();

  for (const file of files) {
    const filename = join(directory, file);
    let value: unknown;

    try {
      value = JSON.parse(readFileSync(filename, "utf8"));
    } catch (error) {
      const reason = error instanceof Error ? error.message : String(error);
      throw new Error(`Invalid JSON in ${filename}: ${reason}`);
    }

    const errors = validateArticle(value);
    if (errors.length > 0) {
      throw new Error(`Invalid article in ${filename}: ${errors.join("; ")}`);
    }

    const article = value as Article;
    if (slugs.has(article.slug)) {
      throw new Error(`Duplicate article slug "${article.slug}" in ${filename}`);
    }

    slugs.add(article.slug);
    articles.push(article);
  }

  return articles.sort(
    (left, right) => Date.parse(right.publishedAt) - Date.parse(left.publishedAt),
  );
}

export function getArticle(slug: string): Article | undefined {
  return loadArticles().find((article) => article.slug === slug);
}

export function getArticlesByCluster(cluster: Article["cluster"]): Article[] {
  return loadArticles().filter((article) => article.cluster === cluster);
}
