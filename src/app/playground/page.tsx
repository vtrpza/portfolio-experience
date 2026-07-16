import type { Metadata } from "next";
import { EditorialPage } from "@/components/editorial-page";

export const metadata: Metadata = {
  title: "Laboratório",
  description:
    "Experimentos públicos de Vitor Pouza em segurança, automação e interfaces interativas.",
};

const experiments = [
  {
    code: "LAB / 01",
    title: "Pesquisa de segurança orientada por hipótese",
    copy: "Escopo explícito, enumeração primeiro, teste controlado depois. Cada passo deixa estado, evidência, limitações e um próximo movimento verificável.",
    detail: "AppSec · análise de código · HTTP/browser · relatórios conservadores",
    href: "https://github.com/vtrpza/ghost-claw",
    label: "Abrir laboratório de segurança",
  },
  {
    code: "LAB / 02",
    title: "Vitor OS — portfólio como interface",
    copy: "Uma experiência pública inspirada em desktop para explorar projetos e identidade. O experimento testa navegação não convencional sem abandonar conteúdo acessível.",
    detail: "JavaScript · interação · design de interface",
    href: "https://vitor-os.vercel.app",
    label: "Executar Vitor OS",
  },
  {
    code: "LAB / 03",
    title: "Produtos com IA sem teatro",
    copy: "OpenAI e Claude entram quando reduzem trabalho ou melhoram uma decisão. Chaves ficam no servidor, falhas são tratadas e a interface não promete certeza onde existe probabilidade.",
    detail: "APIs de IA · pipelines em tempo real · limites operacionais",
    href: "https://github.com/vtrpza",
    label: "Ver experimentos públicos",
  },
] as const;

export default function PlaygroundPage() {
  return (
    <EditorialPage
      code="Índice / 02"
      eyebrow="Laboratório"
      title="Ideias pequenas. Provas executáveis."
      intro="Experimentos existem para reduzir incerteza — não para fingir que todo protótipo já é produto."
      note="Ferramentas de segurança são destinadas exclusivamente a escopos autorizados. Nenhum alvo, credencial ou evidência de cliente é publicado aqui."
    >
      <section className="lab-list" aria-label="Experimentos selecionados">
        {experiments.map((experiment) => (
          <article key={experiment.code}>
            <p>{experiment.code}</p>
            <h2>{experiment.title}</h2>
            <div>
              <p>{experiment.copy}</p>
              <span>{experiment.detail}</span>
            </div>
            <a href={experiment.href} target="_blank" rel="noreferrer">
              {experiment.label} <span aria-hidden="true">↗</span>
            </a>
          </article>
        ))}
      </section>
    </EditorialPage>
  );
}
