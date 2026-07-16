# Portfólio de Vitor Pouza — Plano de Implementação

**Goal:** transformar a fundação existente em um portfólio público completo, baseado em evidência, com uma versão separada e segura para anexar na Workana.

**Architecture:** manter o App Router e o Observatório 3D já existentes. Conteúdo público permanece renderizado no servidor e utilizável sem WebGL; a rota `/workana` é uma folha editorial isolada, sem navegação ou contato externo, preparada para impressão em PDF.

**Tech Stack:** Next.js 16, React 19, TypeScript, CSS existente, React Three Fiber, Vitest. Zero dependências novas.

---

## Contexto e premissas

- O projeto existente passou em lint, tipos, 8 testes e build antes das mudanças.
- Todo conteúdo será em pt-BR.
- Métricas e experiências só serão publicadas quando fornecidas pelo usuário.
- Clientes e projetos confidenciais serão anonimizados.
- O site público pode conter e-mail e GitHub.
- O PDF da Workana não pode conter contato externo.

## Gate 1 — pesquisa e conteúdo

**Aceite:** pesquisa datada salva em `docs/research-2026-07-14.md`; fatos profissionais têm fonte no contexto do usuário; nenhuma métrica inventada.

## Task 1 — identidade, metadata e navegação

**Files:**

- Modify: `src/app/layout.tsx`
- Modify: `src/components/site-nav.tsx`
- Modify: `src/components/hero-copy.tsx`
- Modify: `src/components/experience-shell.tsx`
- Modify: `src/components/observatory-controls.tsx`
- Modify: `src/components/observatory.tsx`
- Modify: testes correspondentes em `src/components/*.test.tsx`

**Steps:**

1. Trocar placeholders por nome, e-mail e GitHub reais.
2. Localizar labels e chamadas para pt-BR.
3. Posicionar produto, plataforma e segurança como três áreas integradas.
4. Atualizar testes para a nova jornada sem reduzir cobertura.

## Task 2 — casos e narrativa profissional

**Files:**

- Replace: `src/app/case-studies/page.tsx`
- Replace: `src/app/about/page.tsx`
- Replace: `src/app/playground/page.tsx`
- Replace: `src/app/uses/page.tsx`
- Modify: `src/components/editorial-page.tsx`
- Modify: `src/app/globals.css`

**Steps:**

1. Implementar três casos anonimizados: MVPs ponta a ponta, SaaS multi-tenant e sistemas financeiros/BI.
2. Implementar laboratório de segurança e experimentos sem divulgar material sensível.
3. Implementar narrativa “sobre” em primeira pessoa e princípios operacionais.
4. Implementar toolkit curto com razões de uso, sem logo cloud.
5. Adicionar CTA final para e-mail e GitHub no site público.

## Gate 2 — revisão de integridade

**Aceite:** busca por `SEU NOME`, `hello@example.com` e `CONTENT SCAFFOLD` retorna zero; nenhuma página contém cliente ou impacto não comprovado.

## Task 3 — versão Workana

**Files:**

- Create: `src/app/workana/page.tsx`
- Modify: `src/app/globals.css`
- Create: `artifacts/portfolio-workana-vitor-pouza.pdf`

**Steps:**

1. Criar apresentação curta orientada a resultado e compreensível para cliente não técnico.
2. Remover e-mail, GitHub, redes, URLs e chamadas para contato externo.
3. Adicionar CSS de impressão A4.
4. Gerar PDF pelo Chromium headless a partir do servidor local.
5. Extrair texto do PDF e verificar ausência de `@`, `github`, `linkedin`, `http` e telefone.

## Task 4 — documentação

**Files:**

- Modify: `README.md`
- Keep: `docs/research-2026-07-14.md`

**Steps:**

1. Registrar estado concluído, rotas, comandos e política de conteúdo.
2. Documentar como regenerar o PDF da Workana.
3. Listar itens opcionais para lançamento público sem tratá-los como entregues.

## Gate 3 — qualidade técnica

Run:

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

**Aceite:** todos os comandos terminam com código 0 e o build lista as rotas públicas mais `/workana` como estáticas.

## Task 5 — validação em navegador

**Steps:**

1. Iniciar `npm run dev`.
2. Confirmar HTTP 200 em `/`, `/case-studies`, `/about`, `/playground`, `/uses` e `/workana`.
3. Inspecionar a homepage em desktop.
4. Inspecionar viewport mobile e fallback 2D.
5. Abrir pelo menos uma rota interna e a versão Workana.
6. Verificar console sem erros.
7. Exercitar CTA principal e links de navegação.

**Aceite:** jornada utilizável por teclado, sem overflow crítico, sem placeholder e sem erro de console.

## Riscos e simplificações deliberadas

- Sem depoimentos: nenhum foi fornecido ou verificado.
- Sem nomes de clientes/cases: confidencialidade e falta de artefatos públicos.
- Sem CMS: o volume atual é pequeno; conteúdo estático é mais simples e rápido.
- Sem formulário: `mailto:` evita backend, spam e tratamento de dados.
- Sem analytics: só adicionar quando houver domínio e objetivo de mensuração.
- Sem deploy público: depende de conta/domínio do usuário; build de produção será validado localmente.
