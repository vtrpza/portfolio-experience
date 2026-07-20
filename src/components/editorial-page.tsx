import type { ReactNode } from "react";
import Link from "next/link";
import { SiteNav } from "./site-nav";

type EditorialPageProps = {
  code: string;
  eyebrow: string;
  title: string;
  intro: string;
  note?: string;
  children?: ReactNode;
};

export function EditorialPage({
  code,
  eyebrow,
  title,
  intro,
  note,
  children,
}: EditorialPageProps) {
  return (
    <div className="content-shell">
      <SiteNav />
      <main id="main-content" className="content-main" tabIndex={-1}>
        <aside className="content-index">
          <p>{code}</p>
          <Link href="/">← Voltar ao início</Link>
        </aside>
        <article className="content-article">
          <header className="content-header">
            <p className="content-overline">{eyebrow}</p>
            <h1>{title}</h1>
            <p className="content-intro">{intro}</p>
          </header>
          {children && <div className="content-body">{children}</div>}
          {note && <p className="content-note">{note}</p>}
        </article>
      </main>
    </div>
  );
}
