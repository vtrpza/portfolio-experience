import Link from "next/link";

export function HeroCopy() {
  return (
    <div className="hero-copy">
      <p className="eyebrow">
        <span>Produto</span>
        <span aria-hidden="true">·</span>
        <span>Engenharia</span>
        <span aria-hidden="true">·</span>
        <span>Segurança</span>
      </p>

      <h1 id="home-title">
        Transformo problemas complexos em produtos confiáveis —{" "}
        <em>da decisão à produção.</em>
      </h1>

      <p className="hero-intro">
        Ajudo fundadores e líderes de produto a reduzir incerteza, construir o
        sistema inteiro e operar com confiança.
      </p>

      <div className="hero-actions">
        <a
          className="primary-action"
          href="mailto:vhnpouza@gmail.com?subject=Novo%20projeto%20via%20vitorpouza.dev"
        >
          Conversar sobre o projeto
          <span aria-hidden="true">↗</span>
        </a>
        <Link className="text-action" href="#trabalhos">
          Ver trabalhos
          <span aria-hidden="true">↓</span>
        </Link>
      </div>
    </div>
  );
}
