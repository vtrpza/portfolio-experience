import type { Metadata } from "next";
import { EditorialPage } from "@/components/editorial-page";

export const metadata: Metadata = {
  title: "Ferramentas",
  description: "Ferramentas atuais de Vitor Pouza e por que cada uma permanece no fluxo.",
};

const tools = [
  {
    category: "Produto web",
    items: [
      ["React + Next.js", "Interfaces e produtos full-stack com uma base única de renderização, rotas e deploy."],
      ["TypeScript", "Contratos explícitos nas fronteiras onde ambiguidade vira defeito caro."],
      ["Node.js", "APIs, integrações e tarefas de produto no mesmo ecossistema da interface."],
    ],
  },
  {
    category: "Dados e operação",
    items: [
      ["PostgreSQL + RLS", "Persistência relacional e isolamento de tenants aplicado perto do dado."],
      ["Docker + Linux", "Ambientes reproduzíveis, deploy previsível e diagnóstico sem depender de painel proprietário."],
      ["Sentry + métricas", "Erro e comportamento observável antes de uma reclamação virar a primeira pista."],
    ],
  },
  {
    category: "Automação e segurança",
    items: [
      ["Python", "Scripts pequenos para análise, automação e tooling de segurança."],
      ["OpenAI + Claude", "IA via API para fluxos com objetivo, limite e fallback definidos."],
      ["HTTP + browser", "Validação do que o sistema realmente faz, não apenas do que o código parece indicar."],
    ],
  },
] as const;

export default function UsesPage() {
  return (
    <EditorialPage
      code="Índice / 04"
      eyebrow="Ferramentas atuais"
      title="Ferramenta é escolha, não identidade."
      intro="Uso um conjunto pequeno de defaults que reduz decisão repetida e continua fácil de operar."
      note="A stack muda quando o problema exige. Não adiciono dependência para substituir uma API nativa ou poucas linhas claras."
    >
      <section className="tool-groups" aria-label="Ferramentas por categoria">
        {tools.map((group) => (
          <section key={group.category}>
            <h2>{group.category}</h2>
            <dl>
              {group.items.map(([name, reason]) => (
                <div key={name}>
                  <dt>{name}</dt>
                  <dd>{reason}</dd>
                </div>
              ))}
            </dl>
          </section>
        ))}
      </section>
    </EditorialPage>
  );
}
