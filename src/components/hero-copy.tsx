import Link from "next/link";

export function HeroCopy() {
  return (
    <div className="hero-copy">
      <p className="eyebrow">
        <span>Produtos web</span>
        <span aria-hidden="true">·</span>
        <span>Integrações</span>
        <span aria-hidden="true">·</span>
        <span>Segurança aplicada</span>
      </p>

      <h1 id="home-title">
        Construo produtos full-stack confiáveis, <em>do problema à produção.</em>
      </h1>

      <p className="hero-intro">
        Há mais de oito anos, uno produto, arquitetura e segurança para lançar e
        evoluir sistemas complexos.
      </p>

      <div className="hero-actions">
        <Link className="primary-action" href="#trabalhos">
          Ver 3 trabalhos
          <span aria-hidden="true">↓</span>
        </Link>
        <a className="text-action" href="mailto:vhnpouza@gmail.com">
          Falar sobre um projeto
        </a>
      </div>
    </div>
  );
}
