# Portfólio — Vitor Pouza

Portfólio baseado em evidência para engenharia full-stack, produto e segurança aplicada. A homepage usa um **Observatório de Sistemas** procedural; o conteúdo principal continua semântico e navegável sem WebGL.

## Conteúdo publicado

- `/` — posicionamento e observatório interativo
- `/case-studies` — ReplyFlow, Blog VR e pesquisa de segurança
- `/playground` — experimentos e laboratório
- `/about` — trajetória e princípios operacionais
- `/uses` — ferramentas atuais com razões de uso
- `/workana` — apresentação isolada, sem contatos externos, para impressão em PDF

A pesquisa de tendências e as regras específicas da Workana estão em [`docs/research-2026-07-14.md`](docs/research-2026-07-14.md).

## Stack

- Next.js App Router + TypeScript strict
- React Three Fiber / Three.js na melhoria progressiva
- HTML semântico independente do WebGL
- fallback visual 2D em telas pequenas
- `prefers-reduced-motion`, foco visível e navegação por teclado
- Vitest + Testing Library

Nenhuma dependência nova foi adicionada para a personalização.

## Executar

```bash
npm ci --include=dev
npm run dev
```

Abra <http://localhost:3000>.

## Verificar

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

## Gerar o PDF seguro para Workana

Com o servidor local ativo:

```bash
mkdir -p artifacts
chromium \
  --headless \
  --no-sandbox \
  --disable-dev-shm-usage \
  --print-to-pdf=artifacts/portfolio-workana-vitor-pouza.pdf \
  http://127.0.0.1:3000/workana
```

Antes de anexar, confirme que o PDF não contém e-mail, telefone, GitHub, LinkedIn ou URL externa. A Workana proíbe contato externo antes da contratação.

## Política de conteúdo

- Não inventar clientes, métricas ou depoimentos.
- Projetos confidenciais permanecem anonimizados.
- Métricas só entram com fonte e escopo conhecidos.
- O site público pode usar e-mail e GitHub; a versão Workana não.

## Deploy

O projeto é compatível com Vercel e com o `Dockerfile` multi-stage incluído. Configuração de deploy não equivale a uma publicação pública: domínio e credenciais do usuário ainda são necessários.
