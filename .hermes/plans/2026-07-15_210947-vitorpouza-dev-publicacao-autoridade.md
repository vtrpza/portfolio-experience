# vitorpouza.dev — Publicação de Autoridade Implementation Plan

> **For Hermes:** Use subagent-driven-development skill to implement this plan task-by-task.

**Status:** aguardando aprovação explícita de Vitor. Não implementar, registrar domínio, publicar, criar recursos Cloudflare ou enviar conteúdo a modelos antes da aprovação.

**Goal:** transformar o portfólio existente em uma publicação pessoal de autoridade que converte somente trabalho real e verificável em artigos e pacotes para Instagram redigidos por IA, sempre com proveniência, privacidade e aprovação humana.

**Architecture:** manter o Next.js existente como site canônico e publicar artigos estáticos a partir de JSON validado. Um comando local recebe um pacote de evidência sanitizado, usa o núcleo editorial adaptado do Blog VR para gerar e auditar um rascunho, e só move o artigo para a árvore pública após aprovação humana. O primeiro release usa Cloudflare Workers Static Assets; D1, Workflows, cron, CRM e publicação automática ficam fora até a operação manual provar necessidade.

**Tech Stack:** Next.js 16.2.10, React 19.2.4, TypeScript strict, Vitest, Node.js 22 com `fetch`/`fs` nativos, OpenAI Responses API por REST, Cloudflare Workers Static Assets via Wrangler.

---

## 1. Decisões para aprovação

| Tema | Decisão proposta |
|---|---|
| Marca | **Vitor Pouza** é a marca. **Observatório de Sistemas** é o conceito editorial/visual. |
| Produto | O site é uma publicação de autoridade baseada no trabalho real, não apenas um portfólio ou blog genérico. |
| Arquitetura inicial | Next.js exportado estaticamente; artigos aprovados versionados como JSON. |
| IA | A IA redige e audita; nunca escolhe sozinha o que é verdade ou publicável. |
| Fontes | Sessões, código, testes, documentos e resultados são descobertos localmente e convertidos em pacotes sanitizados. O modelo nunca recebe acesso livre ao filesystem ou ao histórico. |
| Publicação | Todo artigo fica em `draft` até Vitor executar a aprovação explícita. Não há auto-publicação no MVP. |
| Instagram | Após aprovação do artigo, gerar automaticamente **um carrossel + legenda** derivado do mesmo conteúdo. Não publicar via Meta API no MVP. |
| HTB/CTF | Conteúdo específico de máquina é `manual-only`, exige status `retired` verificado e nível de spoiler `0`. Nenhum raw HTB entra no modelo ou em nova KB. |
| Primeiro canário | Artigo sobre o experimento R2R: **“Por que 965 documentos não tornam um RAG pronto”**, com todas as métricas revalidadas na fonte antes de redigir. |
| Deploy | Primeiro em `workers.dev`; domínio customizado somente depois de posse/DNS confirmados. |
| Automação futura | D1, Workflows, cron, RAG editorial, admin e Instagram API exigem aprovação separada após canários reais. |

## 2. Contexto confirmado

### Projeto principal

`/home/xen0/portfolio-experience`

- Next.js 16.2.10 e React 19.2.4.
- Seis rotas atuais, todas sem Server Actions, cookies, headers dinâmicos ou fetch de servidor detectados.
- `next.config.ts` usa `output: "standalone"`.
- Quatro testes de componentes existentes.
- Diretório ainda não é um repositório Git.
- `.gitignore` já exclui `.env*`, `.next/`, `out/` e credenciais PEM.

### Código reutilizável como referência

`/home/xen0/vr-blog`

Reutilizar apenas mecanismos copy-safe:

- tipos de blocos estruturados;
- `sourceIds` por bloco;
- validação local após Structured Outputs;
- geração → auditoria → no máximo uma correção → auditoria final;
- verificação de URLs públicas;
- detecção de duplicidade;
- escaping e metadados.

Não copiar:

- marca/textos VR;
- clusters jurídicos;
- account IDs, database IDs, Pipedrive IDs ou rotas do cliente;
- meta de 90 posts;
- Pipedrive, Turnstile, batches, Workflows ou cron no MVP;
- allowlist jurídica e regras da OAB.

### Regra HTB atual

As regras atuais do Hack The Box permitem publicação de soluções somente para conteúdo autorizado, como máquinas/challenges/Sherlocks aposentados e categorias gratuitas indicadas. `expired` não equivale a `retired`.

A política atual também proíbe usar conteúdo HTB para treinar, testar, avaliar ou desenvolver IA e para enriquecer datasets/knowledge bases. Portanto:

- nenhum conteúdo específico de máquina será enviado ao OpenAI;
- nenhum novo pacote HTB será promovido a R2R/Cognee;
- runs de agentes em HTB não serão usados como benchmark;
- materiais históricos já promovidos serão apenas inventariados; exclusão/quarentena requer aprovação separada.

Referências:

- https://help.hackthebox.com/en/articles/5188925-streaming-writeups-walkthrough-guidelines
- https://help.hackthebox.com/en/articles/12325897-hack-the-box-platform-rules

## 3. Escopo do MVP

### Incluído

- exportação estática do portfolio;
- índice `/artigos/`;
- páginas `/artigos/<slug>/`;
- conteúdo em JSON estruturado e validado;
- pipeline local de geração e auditoria por IA;
- aprovação humana explícita;
- política editorial única;
- sitemap, robots, canonical, Open Graph e JSON-LD;
- pacote Instagram com carrossel e legenda;
- primeiro artigo canário e seu pacote Instagram;
- deploy estático em Cloudflare;
- gates especiais para HTB/CTF;
- rollback por Git + versão Cloudflare.

### Fora do MVP

- D1, Workflows e cron;
- CMS ou painel admin;
- coleta automática de todas as sessões;
- RAG editorial novo;
- publicação automática no site;
- postagem automática no Instagram;
- criação automática de imagens ou vídeos;
- newsletter, CRM, Pipedrive ou formulário complexo;
- comentários, contas, busca interna ou recomendações personalizadas;
- artigo específico de HTB produzido por IA.

Esses itens não recebem arquivos, interfaces ou placeholders “para depois”.

## 4. Fluxo final

```text
ZONA LOCAL PRIVADA

sessão / repo / teste / artefato
        │
        ▼
seleção manual + sanitização
        │
        ▼
editorial/evidence/<id>.json       (ignorado pelo Git)
        │
        ├── valida autoria/maturidade/privacidade
        ├── bloqueia HTB e material confidencial
        ▼
OpenAI: draft estruturado
        ▼
validador determinístico
        ▼
OpenAI: auditoria factual
        ▼
editorial/drafts/<slug>.json       (ignorado pelo Git)
        │
        ▼ aprovação explícita de Vitor
content/articles/<slug>.json       (versionado e publicável)
        │
        ├── build estático do artigo
        └── gera pacote Instagram sem fatos novos
                ▼
content/social/instagram/<slug>.json
```

## 5. Contratos mínimos de dados

### 5.1 Pacote de evidência privado

```ts
type EvidencePack = {
  id: string;
  titleSeed: string;
  kind: "analysis" | "case-study" | "build-log" | "field-note";
  cluster: "ia-aplicada" | "engenharia-de-produto" | "seguranca-e-evidencia";
  maturity: "shipped" | "verified-experiment" | "prototype" | "research" | "proposal" | "upstream-analysis";
  ownership: "original" | "work-on-upstream" | "third-party-analysis";
  privacy: "public" | "sanitized" | "permission-required" | "blocked";
  platform?: "htb";
  aiPolicy: "allowed" | "manual-only" | "blocked";
  summary: string;
  claims: Array<{ text: string; sourceIds: string[] }>;
  sources: Array<{
    id: string;
    kind: "session" | "file" | "test" | "git" | "public";
    label: string;
    excerpt: string;
    publicUrl?: string;
  }>;
  limitations: string[];
  allowedDomains: string[];
};
```

Regras obrigatórias:

- todo `sourceId` precisa existir;
- afirmação numérica exige fonte;
- `permission-required` e `blocked` não chegam ao modelo;
- `proposal` não pode gerar `case-study`;
- `third-party-analysis` não pode usar linguagem de autoria;
- `platform: "htb"` exige `aiPolicy: "manual-only"` e bloqueia `generate`;
- nenhum segredo, flag, cookie, token, credencial, IP de lab ou PII é aceito.

### 5.2 Artigo público

```ts
type Article = {
  slug: string;
  title: string;
  metaDescription: string;
  excerpt: string;
  kind: EvidencePack["kind"];
  cluster: EvidencePack["cluster"];
  maturity: EvidencePack["maturity"];
  ownership: EvidencePack["ownership"];
  aiDisclosure: "ai-drafted-human-approved" | "human-authored";
  blocks: Array<
    | { type: "heading" | "paragraph" | "callout"; text: string; sourceIds: string[] }
    | { type: "list"; items: string[]; sourceIds: string[] }
  >;
  sources: Array<{ id: string; title: string; url?: string }>;
  limitations: string[];
  publishedAt: string;
  updatedAt: string;
  platform?: "htb";
  contentStatus?: "retired-verified";
  retirementVerifiedAt?: string;
  spoilerLevel?: 0;
};
```

### 5.3 Pacote Instagram

```ts
type InstagramPack = {
  articleSlug: string;
  hook: string;
  caption: string;
  slides: Array<{
    title: string;
    body: string;
    sourceIds: string[];
    altText: string;
  }>;
  hashtags: string[];
  cta: "Leia o artigo completo no link da bio.";
};
```

Regras:

- derivar somente do artigo aprovado;
- não adicionar métricas, histórias ou conclusões novas;
- todo slide factual mantém `sourceIds` do artigo;
- linguagem clara, sem “hacks de crescimento” ou promessa de resultado;
- HTB `manual-only` também bloqueia geração de pacote social específico;
- o MVP gera texto estruturado, não imagens nem postagem automática.

---

## 6. Plano de implementação

### Task 1: Criar baseline versionado

**Objective:** preservar o portfolio atual antes de qualquer alteração.

**Files:**
- Verify: `.gitignore`
- No application files changed.

**Steps:**

1. Executar os checks atuais:

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

Expected: todos com exit code `0`.

2. Inicializar Git local e registrar baseline:

```bash
git init
git add .
git commit -m "chore: baseline portfolio experience"
```

3. Não criar remote ainda. A visibilidade do futuro repositório será decidida após auditar os arquivos versionados.

4. Verificar:

```bash
git status --short
```

Expected: saída vazia.

---

### Task 2: Provar exportação estática

**Objective:** confirmar que o site atual pode ser publicado como Workers Static Assets sem servidor Next.

**Files:**
- Modify: `next.config.ts`

**Target config:**

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  reactStrictMode: true,
};

export default nextConfig;
```

**Steps:**

1. Alterar somente `next.config.ts`.
2. Executar:

```bash
npm run build
```

Expected:

- exit code `0`;
- diretório `out/` criado;
- HTML para `/`, `/about/`, `/case-studies/`, `/playground/`, `/uses/` e `/workana/`;
- fallback 404 produzido.

3. Servir com stdlib:

```bash
python3 -m http.server 4173 -d out
```

4. Em outro terminal, verificar todas as rotas com `curl -I` e inspecionar desktop/mobile no browser.
5. Se o export falhar, parar. Não adicionar OpenNext, adaptador ou proxy. Corrigir somente o bloqueio comprovado ou reavaliar a arquitetura.
6. Commit:

```bash
git add next.config.ts
git commit -m "build: export portfolio as static site"
```

---

### Task 3: Implementar os contratos editoriais com TDD

**Objective:** validar evidência, artigo e pacote Instagram antes de qualquer chamada de modelo ou escrita pública.

**Files:**
- Create: `editorial/article.ts`
- Create: `editorial/article.test.ts`
- Modify: `tsconfig.json` (`allowImportingTsExtensions: true`)
- Modify: `.gitignore`

**Ignore additions:**

```gitignore
/editorial/evidence/
/editorial/drafts/
/editorial/private/
```

**Test cases mínimos:**

1. aceita um pacote sanitizado com todas as claims ligadas a fontes;
2. rejeita `blocked` e `permission-required`;
3. rejeita source ID inexistente;
4. rejeita claim numérica sem fonte;
5. rejeita `proposal` apresentado como case entregue;
6. rejeita autoria própria para projeto de terceiro;
7. rejeita qualquer geração quando `platform=htb`;
8. aceita artigo com blocos e fontes válidos;
9. rejeita bloco factual sem `sourceIds`;
10. rejeita pacote Instagram que introduza source ID ou afirmação ausente no artigo.

**TDD:**

```bash
npm test -- editorial/article.test.ts
```

Expected first: FAIL porque os validadores não existem.

Implementar funções puras no mesmo arquivo:

```ts
validateEvidencePack(value: unknown): string[]
validateArticle(value: unknown): string[]
validateInstagramPack(pack: unknown, article: Article): string[]
assertAiEligible(pack: EvidencePack): void
```

Reexecutar o teste; expected: PASS.

Commit:

```bash
git add editorial/article.ts editorial/article.test.ts tsconfig.json .gitignore
git commit -m "feat: add evidence-backed editorial contracts"
```

---

### Task 4: Adaptar o gerador local do Blog VR

**Objective:** produzir rascunho auditado sem CMS, banco ou serviço residente.

**Files:**
- Create: `scripts/editorial.ts`
- Modify: `package.json`
- Extend test: `editorial/article.test.ts`

**Package script:**

```json
"editorial": "node --experimental-strip-types scripts/editorial.ts"
```

**CLI mínima:**

```text
npm run editorial -- validate <evidence.json>
npm run editorial -- generate <evidence.json>
npm run editorial -- approve <draft.json>
npm run editorial -- social <article.json>
```

**Behavior:**

- `validate`: lê, parseia e valida; não chama rede nem escreve.
- `generate`: valida, exige `OPENAI_API_KEY`, chama Responses API por `fetch`, audita e grava em `editorial/drafts/`.
- `approve`: revalida, exige confirmação explícita no terminal e move para `content/articles/`.
- `social`: aceita somente artigo já aprovado e grava `content/social/instagram/`.

**Generation sequence copied conceptually from VR:**

```text
draft estruturado
→ validação determinística
→ auditoria factual
→ no máximo uma correção
→ auditoria final
→ salvar draft
```

**Hard requirements:**

- `store: false` nas chamadas OpenAI;
- Structured Outputs estrito;
- timeout finito;
- recusa/incomplete tratados como erro;
- registrar response ID e tokens sem registrar prompts sensíveis;
- não escrever HTML gerado;
- URLs públicas limitadas a `allowedDomains`;
- nenhuma chamada quando o pacote falha em privacidade, autoria ou HTB;
- nenhum auto-approve.

**Tests:** usar `fetch` fake, como em `/home/xen0/vr-blog/test/content.test.ts`, para provar:

- duas chamadas no caminho feliz (draft + audit);
- uma correção no máximo;
- falha fechada em recusa, timeout, JSON inválido e auditoria negativa;
- nenhum arquivo público criado antes de `approve`.

**Verification:**

```bash
npm test -- editorial/article.test.ts
npm run typecheck
```

Expected: PASS.

Commit:

```bash
git add scripts/editorial.ts editorial/article.test.ts package.json package-lock.json
git commit -m "feat: add local AI editorial command"
```

---

### Task 5: Carregar artigos aprovados no build

**Objective:** transformar somente JSON aprovado em páginas estáticas.

**Files:**
- Create: `src/lib/articles.ts`
- Create: `src/lib/articles.test.ts`
- Create on first approval: `content/articles/<slug>.json`

**Functions:**

```ts
loadArticles(directory?: string): Article[]
getArticle(slug: string): Article | undefined
getArticlesByCluster(cluster: Article["cluster"]): Article[]
```

**Rules:**

- usar `node:fs` e `node:path`;
- validar cada JSON no build;
- falhar o build em artigo inválido;
- ordenar por `publishedAt` descendente;
- não tolerar slug duplicado;
- diretório vazio retorna lista vazia.

**TDD:** criar diretório temporário com dois artigos e testar ordenação, duplicidade e JSON inválido.

```bash
npm test -- src/lib/articles.test.ts
```

Expected first: FAIL; após implementação: PASS.

Commit:

```bash
git add src/lib/articles.ts src/lib/articles.test.ts
git commit -m "feat: load approved articles at build time"
```

---

### Task 6: Criar índice e página de artigo

**Objective:** expor conteúdo aprovado com a linguagem visual existente.

**Files:**
- Create: `src/app/artigos/page.tsx`
- Create: `src/app/artigos/[slug]/page.tsx`
- Modify: `src/app/globals.css`
- Modify: `src/components/site-nav.tsx`
- Modify: `src/components/site-nav.test.tsx`

**Routes:**

- `/artigos/`: lista por data e cluster; estado vazio honesto quando não há posts.
- `/artigos/<slug>/`: renderiza blocos, fontes, limitações, maturidade, autoria e disclosure de IA.

**Dynamic route requirements:**

- `generateStaticParams()` retorna todos os slugs aprovados;
- `generateMetadata()` define title, description, canonical e Open Graph;
- JSON-LD `Article` usa somente dados validados;
- React renderiza texto, nunca `dangerouslySetInnerHTML`;
- article source IDs viram referências legíveis;
- CTA final aponta para o contato existente;
- link para `/politica-editorial/`.

**Navigation change:** adicionar somente:

```ts
{ href: "/artigos", label: "Artigos" }
```

Revisar mobile; se a navegação não couber, remover “Ferramentas” do header e mantê-la acessível pelo footer/conteúdo. Não criar menu hamburger sem necessidade comprovada.

**Verification:**

```bash
npm test
npm run lint
npm run typecheck
npm run build
```

Expected: PASS, incluindo export estático da rota dinâmica para cada artigo aprovado.

Commit:

```bash
git add src/app/artigos src/app/globals.css src/components/site-nav.tsx src/components/site-nav.test.tsx
git commit -m "feat: publish evidence-backed static articles"
```

---

### Task 7: Adicionar política editorial e SEO básico

**Objective:** tornar IA, proveniência, correções e limites visíveis ao leitor e aos buscadores.

**Files:**
- Create: `src/app/politica-editorial/page.tsx`
- Create: `src/app/sitemap.ts`
- Create: `src/app/robots.ts`
- Modify: `src/app/layout.tsx`
- Modify: `src/app/globals.css`

**A única política editorial deve cobrir:**

- artigos baseados em trabalho real;
- IA como redatora, não fonte da experiência;
- aprovação humana;
- estados `shipped`, `verified-experiment`, `prototype`, `research`, `proposal`, `upstream-analysis`;
- correções e data de atualização;
- autoria e atribuição a upstream;
- dados de clientes e engagements;
- HTB/CTF e spoiler level;
- canal para solicitar correção.

Não criar páginas separadas de correções, IA e privacidade no MVP.

**Metadata:**

```ts
metadataBase: new URL("https://vitorpouza.dev")
```

Só habilitar indexação de produção. Preview `workers.dev` deve usar robots `noindex`/`Disallow` até o domínio final estar aprovado.

**Tests:** importar `sitemap()` e confirmar que inclui rotas estáticas e artigos aprovados sem duplicidade.

**Verification:**

```bash
npm test
npm run lint
npm run typecheck
npm run build
```

Commit:

```bash
git add src/app/politica-editorial src/app/sitemap.ts src/app/robots.ts src/app/layout.tsx src/app/globals.css
git commit -m "feat: add editorial transparency and SEO metadata"
```

---

### Task 8: Gerar o pacote Instagram do artigo aprovado

**Objective:** transformar cada artigo aprovado em conteúdo pronto para revisão e postagem manual.

**Files:**
- Logic remains in: `scripts/editorial.ts`
- Validation remains in: `editorial/article.ts`
- Test: `editorial/article.test.ts`
- Output: `content/social/instagram/<article-slug>.json`

**MVP output:**

- uma frase-hook;
- legenda;
- carrossel curto;
- alt text por slide;
- hashtags moderadas;
- CTA para o artigo no link da bio.

**Generation rule:** o modelo recebe apenas o artigo público aprovado, não o pacote privado de evidência.

**Tests:**

- rejeitar pacote com afirmação ausente no artigo;
- rejeitar source ID inexistente;
- rejeitar CTA enganoso;
- bloquear HTB;
- garantir que `social` não altera o artigo.

**Manual deliverable:** JSON copiável. Renderização de cards/imagens e Meta API ficam fora do MVP.

**Verification:**

```bash
npm run editorial -- social content/articles/<slug>.json
npm test -- editorial/article.test.ts
```

Expected: JSON válido em `content/social/instagram/` e nenhum arquivo adicional.

Commit:

```bash
git add scripts/editorial.ts editorial/article.ts editorial/article.test.ts content/social/instagram/<slug>.json
git commit -m "feat: generate Instagram packs from approved articles"
```

---

### Task 9: Produzir e aprovar o primeiro canário

**Objective:** provar o ciclo completo com uma história real antes de generalizar.

**Private input:**

`editorial/evidence/r2r-retrieval-canary.json`

**Public article candidate:**

`content/articles/por-que-965-documentos-nao-tornam-um-rag-pronto.json`

**Instagram candidate:**

`content/social/instagram/por-que-965-documentos-nao-tornam-um-rag-pronto.json`

**Steps:**

1. Reabrir as sessões e artefatos originais.
2. Revalidar todas as métricas; memória e respostas anteriores não bastam como prova.
3. Montar pacote sanitizado com claims e limitações.
4. Executar `validate`.
5. Executar `generate`.
6. Revisar factualidade, autoria, privacidade, tom e utilidade.
7. Vitor aprova ou rejeita o draft.
8. Somente após aprovação, executar `approve`.
9. Gerar pacote Instagram.
10. Vitor revisa separadamente o pacote social.
11. Executar build e inspeção visual desktop/mobile.

**Go/no-go do canário:**

- nenhuma claim sem fonte;
- nenhuma métrica inventada;
- nenhum dado privado;
- limitações explícitas;
- linguagem “demonstrei neste experimento”, não “provei universalmente”;
- artigo útil a profissional técnico e comprador técnico;
- pacote Instagram não cria fatos novos;
- aprovação humana registrada no commit.

Commit após aprovação:

```bash
git add content/articles content/social src
git commit -m "content: publish R2R retrieval canary"
```

---

### Task 10: Integrar CTF/HTB sem spoilers e sem violar o gate de IA

**Objective:** permitir field notes manuais e impedir publicação incompatível com as regras atuais.

**Files:**
- Validator: `editorial/article.ts`
- Test: `editorial/article.test.ts`
- Private audit output: `editorial/private/htb-policy-audit.md`
- No public HTB article in the first release.

**Automated gate:**

```ts
if (pack.platform === "htb") {
  throw new Error("HTB machine-specific content is manual-only and cannot enter the AI pipeline");
}
```

Um artigo HTB manual só passa no loader público quando contém:

```ts
{
  platform: "htb",
  contentStatus: "retired-verified",
  retirementVerifiedAt: "YYYY-MM-DD",
  spoilerLevel: 0,
  aiDisclosure: "human-authored"
}
```

**Read-only compliance audit:**

1. Inventariar documentos R2R/Cognee derivados de HTB.
2. Inventariar runs de avaliação/benchmark de agentes em HTB.
3. Não deletar nem alterar nada.
4. Registrar origem, risco e recomendação em `editorial/private/htb-policy-audit.md`.
5. Solicitar aprovação separada para quarentena/exclusão.

**Formato futuro da série:**

> **Depois da Flag — raciocínio e aprendizado sem entregar a solução**

Permitido no artigo manual:

- modelo mental;
- hipóteses descartadas em alto nível;
- rabbit holes;
- processo e ferramentas sem cadeia;
- lição defensiva;
- o que faria diferente.

Proibido:

- flags, hashes, credenciais, IP, portas decisivas;
- payload, endpoint, filename ou cadeia completa;
- screenshots de solução;
- path de privilégio;
- qualquer conteúdo ativo/Enterprise não autorizado.

Commit apenas do código do gate e testes. O audit privado permanece ignorado.

---

### Task 11: Configurar deploy estático em Cloudflare

**Objective:** publicar o export sem adicionar runtime, banco ou binding.

**Files:**
- Create: `wrangler.jsonc`
- Modify: `package.json`
- Modify: `package-lock.json`

**Dependency:**

```bash
npm install -D wrangler@latest
```

**Minimal `wrangler.jsonc`:**

```jsonc
{
  "$schema": "./node_modules/wrangler/config-schema.json",
  "name": "vitorpouza-dev",
  "compatibility_date": "2026-07-15",
  "assets": {
    "directory": "./out",
    "not_found_handling": "404-page"
  }
}
```

Antes de usar, validar este shape contra `node_modules/wrangler/config-schema.json`. Não incluir `account_id`, IDs da VR, D1, bindings, secrets ou placeholders de cliente.

**Scripts:**

```json
"deploy:dry": "npm run build && wrangler deploy --dry-run",
"deploy": "npm run build && wrangler deploy"
```

**Steps:**

1. `wrangler whoami`.
2. `npm run deploy:dry` — expected exit `0`.
3. `npm run deploy` para preview `workers.dev`.
4. Confirmar `robots` bloqueando indexação no preview.
5. Smoke test de todas as rotas.
6. Inspeção visual e console sem erros.
7. Só depois de domínio registrado e DNS controlado, configurar custom domain.
8. Em produção, habilitar sitemap e indexação.

**Rollback:**

```bash
wrangler versions list
wrangler rollback <VERSION_ID>
```

E, para conteúdo:

```bash
git revert <CONTENT_COMMIT>
npm run deploy
```

Commit:

```bash
git add wrangler.jsonc package.json package-lock.json
git commit -m "deploy: publish static site on Cloudflare Workers"
```

---

### Task 12: Go-live e operação editorial

**Objective:** lançar com uma rotina pequena, mensurável e reversível.

**Initial content backlog:**

| Prioridade | Pauta | Estado/risco |
|---|---|---|
| 1 | Por que 965 documentos não tornam um RAG pronto | Canário; revalidar métricas |
| 2 | Recon produz dados; agentes precisam de evidência | `reconctx`; marcar como discovery |
| 3 | Fail-closed em pipelines editoriais com IA | Blog VR; requer autorização ou anonimização |
| 4 | O limite era dez ou doze? | Cliente; anonimizar ou obter autorização |
| 5 | Estado de agentes deve viver fora da conversa | Análise upstream com atribuição |
| 6 | WebGL como melhoria progressiva | Projeto próprio/publicável |
| Hold | CTF Field Notes | Manual-only; publicar apenas retired verificado |

**Cadence inicial:**

- produzir um pacote de evidência por vez;
- publicar somente quando o artigo passa todos os gates;
- gerar o Instagram pack depois da aprovação do artigo;
- postagem no Instagram continua manual;
- revisar Search Console mensalmente;
- criar páginas-pilar somente quando cada cluster tiver material suficiente. Não criar páginas vazias agora.

**Métricas úteis:**

- impressões e cliques não-branded;
- artigos que levam a cases/contato;
- contatos qualificados citando conteúdo;
- backlinks e compartilhamentos;
- tempo de revisão humana e taxa de drafts rejeitados;
- posts sociais que geram visita ao artigo.

Sem meta artificial de volume.

---

## 7. Verificação final obrigatória

### Código

```bash
npm run lint
npm run typecheck
npm test
npm run build
npm run deploy:dry
```

Todos devem retornar exit code `0`.

### Rotas

Verificar no export e no preview Cloudflare:

```text
/
/about/
/case-studies/
/playground/
/uses/
/workana/
/artigos/
/artigos/<canary>/
/politica-editorial/
/sitemap.xml
/robots.txt
/rota-inexistente/ → 404
```

### Conteúdo

- artigo aprovado aparece;
- draft não aparece;
- source IDs resolvem;
- disclosure de IA visível;
- limitações visíveis;
- upstream atribuído;
- nenhum conteúdo privado no HTML/source map;
- Instagram pack corresponde ao artigo;
- HTB continua bloqueado no gerador.

### UX

- desktop e mobile inspecionados;
- teclado e foco visível;
- reduced motion preservado;
- site continua útil sem WebGL;
- sem overflow na navegação;
- console sem erro;
- 404 real, não 200 genérico.

### Segurança e privacidade

- `.env*`, evidence packs, drafts e audit privado ignorados;
- nenhum segredo no Git;
- nenhum account/database/CRM ID da VR;
- nenhum raw de cliente/engagement enviado ao modelo;
- nenhuma máquina HTB ativa ou conteúdo específico processado por IA.

---

## 8. Gates de evolução — fora desta aprovação

### Adicionar D1 + Workflows somente quando

- o fluxo estático tiver vários artigos aprovados;
- a operação manual estiver causando atrito observado;
- o schema editorial estiver estável;
- custos e taxa de rejeição forem conhecidos;
- houver nova aprovação explícita.

### Adicionar renderizador de carrossel somente quando

- os pacotes de texto forem usados de forma recorrente;
- formato visual estiver definido;
- houver necessidade real de exportar imagens prontas.

Primeira opção futura: HTML/CSS + screenshot headless. Não adicionar Canvas, design SDK ou gerador de vídeo sem necessidade comprovada.

### Adicionar postagem automática no Instagram somente quando

- conta profissional e Meta App estiverem disponíveis;
- revisão humana continuar obrigatória;
- escopo/permissões da API forem verificados na documentação atual;
- houver necessidade recorrente que justifique tokens, webhooks e manutenção.

### Adicionar RAG editorial somente quando

- busca por sessão/arquivo e pacotes explícitos não forem suficientes;
- a coleção usar somente evidência publicável;
- HTB e engagements estiverem tecnicamente excluídos;
- retrieval tiver benchmark e gate próprios.

---

## 9. Aprovação solicitada

Aprovar ou rejeitar como um pacote:

- [ ] Marca pessoal **Vitor Pouza** + conceito **Observatório de Sistemas**.
- [ ] Site estático primeiro; sem D1/Workflows no MVP.
- [ ] Artigos redigidos por IA somente a partir de pacotes sanitizados.
- [ ] Aprovação humana obrigatória antes de versionar/publicar.
- [ ] Instagram: carrossel + legenda automáticos, postagem manual.
- [ ] HTB: manual-only, retired verificado, spoiler 0 e audit separado.
- [ ] Primeiro canário sobre o experimento R2R.
- [ ] Deploy inicial em Cloudflare `workers.dev`, domínio depois.
- [ ] Nenhuma implementação antes da aprovação explícita deste documento.

## 10. Resultado esperado do MVP

Ao final, `vitorpouza.dev` terá:

1. a experiência visual já existente;
2. um índice de artigos reais e versionados;
3. geração por IA com proveniência e auditoria;
4. publicação controlada por Vitor;
5. conteúdo social derivado sem fatos novos;
6. política editorial transparente;
7. gates fortes para cliente, autoria e HTB;
8. deploy estático barato, simples e reversível;
9. nenhuma infraestrutura especulativa.
