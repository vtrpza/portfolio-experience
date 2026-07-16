import type { Metadata } from "next";
import { EditorialPage } from "@/components/editorial-page";

export const metadata: Metadata = {
  title: "Sobre",
  description:
    "Como Vitor Pouza trabalha: produto, arquitetura, entrega e segurança no mesmo sistema.",
  alternates: { canonical: "/about/" },
};

const principles = [
  {
    number: "01",
    title: "O problema vem antes da stack.",
    copy: "Tecnologia é uma decisão de custo, risco e manutenção. Escolho a menor arquitetura que atende o problema real e deixa uma rota clara de evolução.",
  },
  {
    number: "02",
    title: "Produção faz parte da entrega.",
    copy: "Build local não encerra projeto. Deploy, observabilidade, falhas previsíveis e uma passagem de bastão compreensível fazem parte do trabalho.",
  },
  {
    number: "03",
    title: "Segurança precisa de evidência.",
    copy: "Hipótese não é achado e ferramenta não é prova. Valido a camada alcançada, registro limitações e escrevo impacto sem exagero.",
  },
  {
    number: "04",
    title: "Simplicidade é trabalho de engenharia.",
    copy: "Prefiro apagar dependências e estados desnecessários. O código mais fácil de operar às três da manhã quase sempre é o menos surpreendente.",
  },
] as const;

export default function AboutPage() {
  return (
    <EditorialPage
      code="Índice / 03"
      eyebrow="Como trabalho"
      title="Autonomia sem caixa-preta."
      intro="Assumo o problema inteiro, torno as decisões visíveis e entrego uma solução que outra pessoa consegue manter."
    >
      <section className="narrative" aria-label="Trajetória profissional">
        <p>
          Sou Vitor Pouza, engenheiro full-stack com mais de oito anos de experiência.
          Nos últimos dois, trabalho como consultor independente, conduzindo produtos do
          primeiro commit ao deploy em produção.
        </p>
        <p>
          Antes disso, passei pela GFT Technologies e pela act digital. Evoluí de
          desenvolvedor pleno a sênior trabalhando com sistemas financeiros, dashboards
          de BI e plataformas usadas por dezenas de milhares de pessoas todos os dias.
        </p>
        <p>
          Hoje meu trabalho combina produto, arquitetura e segurança. Posso desenhar uma
          experiência em React, estruturar uma API em Node.js, isolar tenants no PostgreSQL,
          integrar OpenAI ou Claude e investigar o sistema por caminhos que uma revisão
          funcional comum não enxerga.
        </p>
      </section>

      <section className="principles" aria-labelledby="principles-title">
        <p className="section-code">Princípios operacionais</p>
        <h2 id="principles-title">O que permanece quando a stack muda.</h2>
        <ol>
          {principles.map((principle) => (
            <li key={principle.number}>
              <span>{principle.number}</span>
              <div>
                <h3>{principle.title}</h3>
                <p>{principle.copy}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="contact-panel" aria-labelledby="contact-title">
        <p className="section-code">Próximo problema</p>
        <h2 id="contact-title">Se é complexo, dá para tornar claro.</h2>
        <p>Trabalho em português e inglês com equipes locais ou internacionais.</p>
        <div>
          <a className="primary-action" href="mailto:vhnpouza@gmail.com">Enviar e-mail <span aria-hidden="true">↗</span></a>
          <a className="text-action" href="https://github.com/vtrpza" target="_blank" rel="noreferrer">Ver GitHub</a>
        </div>
      </section>
    </EditorialPage>
  );
}
