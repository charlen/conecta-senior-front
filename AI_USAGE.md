# AI_USAGE.md - Conecta Sênior Frontend

Este documento registra o histórico de instruções naturais recebidas, interpretações técnicas e entregas realizadas pelo agente de IA durante a refatoração e evolução da UI do projeto Conecta Sênior.

## Fase 1 - Normalização de botões e tema Material 3

**O que foi pedido**
Por linguagem natural, o desenvolvedor solicitou normalizar botões para o atom `Button` e tema Material 3, com correções em `EntrevistaPage`, `CurriculoPage`, `PreferenciasPage` e `VagasPage`. Padrão mantido de tamanho 52px, fonte 20px, foco visível, contraste 60+.

**Como foi pedido**
Especificação técnica de uso de `Button` com `variant="secondary"/"primary"`, substituição de `<textarea>` por atom `Textarea`, layout em `.row`, validação via `npm run lint` e `npm run build`.

**O que foi entregue**
- `EntrevistaPage` e `CurriculoPage` refatorados para usar `Button` atom
- `Textarea` atom adotado
- Validação `npm run lint` exit 0 e `npm run build` ✓ built
- Comentário na tarefa 707

## Fase 2 - Dados de vagas com título e descrição

**O que foi pedido**
As vagas do passo 5 estavam sem título e descrição; a demonstração precisava ter isso.

**Como foi pedido**
Solicitação natural para incluir título, descrição e demonstração completa.

**O que foi entregue**
- `src/mocks/data.ts` atualizado para campos MVP: empresa, cargo, tipo, area, desc, score, motivo
- `VagasPage` exibe título, descrição, motivo e Pill com % compatível
- Build e lint validados

## Fase 3 - Acessibilidade de contraste

**O que foi pedido**
Contraste da tela de detalhes da vaga estava baixo, usuário com 40 anos não conseguia ver direito.

**Como foi pedido**
Reclamação por linguagem natural sobre legibilidade.

**O que foi entregue**
- Tokens ajustados: `--md-sys-color-on-surface:#1a1a1a`, `--md-sys-color-on-surface-variant:#4a5568`, `--md-sys-color-outline:#5a6475`
- `.mut` agora usa `on-surface-variant`
- Build/lint OK

## Fase 4 - Badges para contexto

**O que foi pedido**
A linha “Meio período · Atendimento · Combina…” deveria ser badges com cor de fundo para separação de contexto.

**Como foi pedido**
Sugestão natural de UX com badges coloridos.

**O que foi entregue**
- Classe `.badge` adicionada em `tokens.css`
- `VagasPage` renderiza tipo, área e motivo como badges
- Build/lint OK

## Fase 5 - Refatoração completa para Tailwind com diretrizes WCAG 60+

**O que foi pedido**
Atuar como Engenheiro Frontend especialista em UX/UI e Acessibilidade WCAG. Refatorar telas Conecta Sênior com React, TypeScript e Tailwind CSS para público 60+, seguindo diretrizes detalhadas de paleta, tipografia, inputs, botões, stepper e cards de vagas.

**Como foi pedido**
Especificação técnica rigorosa com tokens Tailwind: bg-slate-50, text-slate-800/600, bg-blue-600, bordas slate, tamanhos mínimos lg/xl, line-height relaxed, inputs `w-full p-4 text-lg...`, botões `px-6 py-3.5 text-lg...`, stepper com barra progresso, cards com sombras suaves, tags e compatibilidade.

**O que foi entregue**
- Tarefas criadas e cadastradas: 708, 709, 710, 711, 712, 713
- Tailwind v4 configurado com `@import "tailwindcss"`, `tailwind.config.js`, `postcss.config.js`
- `PageTemplate`, `StepTemplate`, `Button`, `Input`, `Textarea`, `Label` refatorados
- `VagasPage` com cards Tailwind, badges, tag compatibilidade
- Build/lint OK

## Fase 6 - Correções de aparência e cor primária

**O que foi pedido**
Botões sem aparência, caixas de texto pequenas, cor #0ac removida, necessidade de botões grandes, caixas grandes, experiência 60+.

**Como foi pedido**
Reclamação natural e pedido para incluir cor #0ac e depois azul.

**O que foi entregue**
- Migração para Tailwind v4 correta com `@import`
- Cor primária `#0ac` adicionada, depois ajustada para `#2563eb` para contraste
- Botões aumentados para `px-8 py-4 text-xl min-h-[56px]`
- Inputs/Textarea `p-5 text-xl border-2 rounded-2xl`
- Labels `text-xl font-bold`
- Progress bar com background inline
- Build OK

## Fase 7 - Landing page inicial

**O que foi pedido**
Ajustar primeira tela para ficar semelhante a landing page, com título grande, subtítulo-slogan, breve descrição e CTA, elegante e acessível.

**Como foi pedido**
Exemplo de código React de landing page duas colunas fornecido, pedido para adaptar aplicando princípios de acessibilidade.

**O que foi entregue**
- `WelcomePage` refatorado para layout duas colunas
- Lado esquerdo azul com “Plataforma Exclusiva”, título 5xl/6xl
- Lado direito com slogan 4xl/5xl, descrição 2xl, aviso MVP amber, botão full-width
- Build OK

## Fase 8 - Governança e documentação

**O que foi pedido**
Commit e push para main, atualizar `AGENTS.md` e `CHANGELOG.md`.

**Como foi pedido**
Instruções naturais de versionamento e documentação.

**O que foi entregue**
- Commit e push da refatoração completa
- `AGENTS.md` atualizado com estrutura atual, convenções Tailwind v4, acessibilidade 60+
- `CHANGELOG.md` atualizado com entrada 2026-10-27 detalhando Added/Changed/Fixed
- Commits enviados para main

---

**Resumo geral**
Todas as solicitações foram interpretadas por linguagem natural, traduzidas para especificações técnicas concretas, implementadas com validação de lint/build, documentadas em tarefas e commits, e alinhadas às diretrizes de acessibilidade WCAG para usuários 60+.
