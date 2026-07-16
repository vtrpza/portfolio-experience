import type { Metadata } from "next";
import { EditorialPage } from "@/components/editorial-page";

export const metadata: Metadata = {
  title: "Política editorial",
  description:
    "Como Vitor Pouza verifica evidências, usa IA, atribui autoria e corrige os artigos publicados.",
  alternates: { canonical: "/politica-editorial/" },
};

export default function EditorialPolicyPage() {
  return (
    <EditorialPage
      code="Política / 01"
      eyebrow="Transparência editorial"
      title="A experiência é a fonte. IA é ferramenta de redação."
      intro="Esta política reúne os critérios de evidência, autoria, privacidade, revisão e correção aplicados a toda publicação deste site."
    >
      <div className="editorial-policy">
        <section>
          <p className="section-code">01 / Evidência</p>
          <h2>Artigos começam em trabalho real.</h2>
          <p>
            Cada texto nasce de código, testes, documentos, resultados ou sessões que posso
            reabrir e verificar. Afirmações factuais mantêm referências; números precisam de
            fonte e escopo. Rascunhos, memória e respostas anteriores de modelos não contam
            como prova.
          </p>
        </section>

        <section>
          <p className="section-code">02 / IA e aprovação</p>
          <h2>O modelo redige; não decide o que aconteceu.</h2>
          <p>
            Quando indicado como “IA redigiu; humano verificou e aprovou”, um modelo recebeu
            apenas um pacote sanitizado de evidências. A saída passa por validação local,
            auditoria factual e revisão humana. Nada é publicado automaticamente. Textos
            marcados como “Autoria humana” não passaram pelo gerador.
          </p>
        </section>

        <section>
          <p className="section-code">03 / Estado do trabalho</p>
          <h2>Maturidade não é escondida pelo tom.</h2>
          <dl>
            <div><dt>shipped</dt><dd>Entregue e usado no contexto declarado.</dd></div>
            <div><dt>verified-experiment</dt><dd>Experimento reproduzido, sem generalização universal.</dd></div>
            <div><dt>prototype</dt><dd>Protótipo funcional, ainda sem prova de operação contínua.</dd></div>
            <div><dt>research</dt><dd>Investigação documentada, não uma entrega de produto.</dd></div>
            <div><dt>proposal</dt><dd>Direção ou hipótese ainda não implementada.</dd></div>
            <div><dt>upstream-analysis</dt><dd>Análise de um projeto de terceiros, com atribuição explícita.</dd></div>
          </dl>
        </section>

        <section>
          <p className="section-code">04 / Autoria e confidencialidade</p>
          <h2>Trabalho de terceiros continua sendo de terceiros.</h2>
          <p>
            Projetos upstream são atribuídos e nunca descritos como criação própria. Dados de
            clientes, engagements e pessoas só entram com autorização ou anonimização que
            preserve a utilidade sem permitir reidentificação. Segredos, credenciais, cookies,
            tokens, PII e infraestrutura privada são bloqueados antes da redação.
          </p>
        </section>

        <section>
          <p className="section-code">05 / HTB e CTF</p>
          <h2>Depois da flag, sem entregar a solução.</h2>
          <p>
            Conteúdo específico de Hack The Box não entra no pipeline de IA. Uma nota manual só
            pode tratar conteúdo cuja aposentadoria foi verificada, com spoiler level zero e sem
            flags, hashes, credenciais, IPs, portas decisivas, payloads, endpoints ou cadeias de
            exploração. Conteúdo ativo, Enterprise ou sem autorização não é publicado.
          </p>
        </section>

        <section>
          <p className="section-code">06 / Correções</p>
          <h2>Atualizações ficam visíveis.</h2>
          <p>
            Artigos exibem datas de publicação e atualização. Erros factuais são corrigidos na
            fonte versionada e republicados; mudanças materiais atualizam a data. Para apontar
            um erro, envie a URL e a evidência para <a href="mailto:vhnpouza@gmail.com">vhnpouza@gmail.com</a>.
          </p>
        </section>
      </div>
    </EditorialPage>
  );
}
