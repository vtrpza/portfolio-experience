import Link from "next/link";

const navigation = [
  { href: "/case-studies", label: "Trabalhos" },
  { href: "/playground", label: "Laboratório" },
  { href: "/artigos", label: "Artigos" },
  { href: "/about", label: "Sobre" },
  { href: "/uses", label: "Ferramentas" },
] as const;

export function SiteNav() {
  return (
    <>
      <a className="skip-link" href="#main-content">Pular para o conteúdo</a>
      <header className="site-header">
        <Link className="brand" href="/" aria-label="Início">
          <span className="brand-logo" aria-hidden="true" />
          <span>VITOR POUZA</span>
        </Link>

        <nav className="desktop-nav" aria-label="Navegação principal">
          <ul className="nav-list">
            {navigation.map((item) => (
              <li key={item.href}>
                <Link href={item.href}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <a className="availability" href="mailto:vhnpouza@gmail.com">
          <span aria-hidden="true" />
          Disponível para projetos
        </a>

        <details className="mobile-menu">
          <summary>
            <span>Menu</span>
            <span className="menu-icon" aria-hidden="true" />
          </summary>
          <div className="mobile-menu-panel">
            <nav aria-label="Navegação móvel">
              <ul className="mobile-nav-list">
                {navigation.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href}>{item.label}</Link>
                  </li>
                ))}
              </ul>
            </nav>
            <a className="mobile-availability" href="mailto:vhnpouza@gmail.com">
              <span aria-hidden="true" />
              Disponível para projetos
            </a>
          </div>
        </details>
      </header>
    </>
  );
}
