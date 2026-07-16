import Link from "next/link";

export function HeroCopy() {
  return (
    <div className="hero-copy">
      <p className="eyebrow">
        <span>Engenharia full-stack</span>
        <span aria-hidden="true">/</span>
        <span>Segurança aplicada</span>
      </p>

      <h1>
        Transformo problemas complexos em <em>produtos confiáveis.</em>
      </h1>

      <p className="hero-intro">
        Há mais de oito anos, trabalho do primeiro commit ao deploy: produto,
        arquitetura e segurança tratados como um único sistema.
      </p>

      <div className="hero-actions">
        <Link className="primary-action" href="/case-studies">
          Ver trabalhos
          <span aria-hidden="true">↗</span>
        </Link>
        <a className="text-action" href="mailto:vhnpouza@gmail.com">
          Iniciar conversa
        </a>
      </div>
    </div>
  );
}
