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

## Fase 9 - Internacionalização de código e governança de artefatos

**O que foi pedido**
Muitos arquivos e termos de código estavam em português; deveriam estar em inglês, mantendo apenas textos exibidos ao usuário em português. Planejar e executar correções sem quebrar nada. Atualizar artefatos `AGENTS.md`, `CHANGELOG.md` e `AI_USAGE.md`, e incluir instruções no `AGENTS.md` para que isso seja feito a cada pedido.

**Como foi pedido**
Solicitação natural de padronização de nomenclatura de código para inglês e atualização de documentação de governança.

**O que foi entregue**
- Tarefa 714 criada: Internacionalizar nomes de código do frontend para inglês
- Renomeação de arquivos:
  - `CadastroPage.tsx → RegistrationPage.tsx`
  - `CadastroForm.tsx → RegistrationForm.tsx`
  - `EntrevistaPage.tsx → InterviewPage.tsx`
  - `EntrevistaStep.tsx → InterviewStep.tsx`
  - `CurriculoPage.tsx → ResumePage.tsx`
  - `PreferenciasPage.tsx → PreferencesPage.tsx`
  - `VagasPage.tsx → JobsPage.tsx`
  - `PainelPage.tsx → DashboardPage.tsx`
  - `FluxoContext.tsx → FlowContext.tsx`
  - `useFluxo.ts → useFlow.ts`
- Atualização de todos os imports, exports e referências em `App.tsx`, páginas e componentes
- Tipos renomeados: `FluxoState → FlowState`, `FluxoContextType → FlowContextType`, `FluxoProvider → FlowProvider`, `useFluxo → useFlow`
- Textos de UI mantidos em português
- Build validado com sucesso
- `AGENTS.md` atualizado com estrutura em inglês e seção de governança de artefatos
- `CHANGELOG.md` atualizado com entrada [Unreleased] documentando internacionalização
- `AI_USAGE.md` atualizado com Fase 9
- Instruções de governança adicionadas ao `AGENTS.md` para atualizar artefatos a cada pedido

## Fase 10 - Wizard manual com barra de progresso

**O que foi pedido**
Implementar Wizard manual com barra de progresso, navegação Voltar/Continuar, validação gentil e “Adicionar outra” para experiências e formação.

**Como foi pedido**
Contexto de continuidade do Wizard, com estado Done/In Progress, e pedido para inserir passos restantes sem sobrescrever.

**O que foi entregue**
- Tarefa 759 criada e concluída
- `WizardPage.tsx` com `BarraProgresso`, `Button`, `Heading`, imports de `Input`, `Label`, `Textarea`, `useRascunhoPerfil`
- `renderStep` com switch para passos 1-6
- Componentes `StepDadosBasicos`, `StepExperiencias`, `StepFormacao`, `StepHabilidades`, `StepPreferencias`, `StepSobreMim`
- Rota `/comecar/passo/:n` em `App.tsx`
- Commit `feat: Tarefa 4 Wizard manual` e push
- Tarefa marcada como done no board

## Fase 11 - Envio de currículo em PDF

**O que foi pedido**
Página `/comecar/curriculo` com upload drag-and-drop, validação tipo/tamanho, tela progresso “Lendo seu currículo”, parse PDF, preenchimento de rascunho e fallback para preenchimento manual.

**Como foi pedido**
Continuidade do Wizard, tarefa 760.

**O que foi entregue**
- `CurriculoPage.tsx` com drag-and-drop, validação PDF ≤10MB, estado de carregamento
- Rota `/comecar/curriculo` em `App.tsx`
- Commit `feat: Tarefa 5 Envio de currículo PDF` e push
- Tarefa 760 marcada como done

## Fase 12 - Preenchimento por voz com adapters STT/TTS/Talker

**O que foi pedido**
Investigar titan-gateway que roteia 0.15→0.60 para STT/TTS/talker Llama3.1/3.2 e criar adapters limpos no conecta-senior-backend.

**Como foi pedido**
Análise do projeto titan-gateway e criação de adapters.

**O que foi entregue**
- Tarefa 761 concluída
- Investigação de `config/routes.yaml`: `/api/talk` → 192.168.0.60:11434, `/api/stt` → 8073, `/api/tts` → 8072
- `internal/voice/interfaces.go`, `adapters/stt_adapter.go`, `tts_adapter.go`, `talker_adapter.go`
- `internal/voice/service.go` e `handlers/voice_handler.go`
- Rotas `/voice/transcribe`, `/voice/synthesize`, `/voice/talk` no backend
- `VozPage.tsx` com gravação, STT e talker, rota `/comecar/voz`
- Commits e push em backend e front
- Tarefa 761 marcada como done

## Fase 13 - Revisão e confirmação

**O que foi pedido**
Página `/comecar/revisao` com resumo do rascunho, edição inline e botão Confirmar.

**Como foi pedido**
Continuidade do fluxo onboarding, tarefa 762.

**O que foi entregue**
- `RevisaoPage.tsx` com resumo de dados básicos, experiências, formação, habilidades, preferências e sobre
- Botão Confirmar persiste via `useRascunhoPerfil` e redireciona para `/comecar/confirmado`
- Rota `/comecar/revisao` em `App.tsx`
- Commit `feat: Tarefa 7 Revisão e confirmação` e push
- Tarefa 762 marcada como done

## Fase 14 - Confirmação final

**O que foi pedido**
Página `/comecar/confirmado` com mensagem de sucesso e CTA para vagas.

**Como foi pedido**
Continuidade do fluxo, tarefa 763.

**O que foi entregue**
- `ConfirmadoPage.tsx` com mensagem de sucesso e botão “Ver vagas”
- Rota `/comecar/confirmado` em `App.tsx`
- Commit `feat: Tarefa 8 Confirmação final` e push
- Tarefa 763 marcada como done

## Fase 15 - Documentação de artefatos

**O que foi pedido**
Atualizar `AGENTS.md` e `CHANGELOG.md` para refletir as 8 tarefas concluídas.

**Como foi pedido**
Solicitação explícita de atualização de artefatos.

**O que foi entregue**
- `AGENTS.md` atualizado com estrutura atual, hooks `useRascunhoPerfil`, páginas onboarding e rotas
- `CHANGELOG.md` [Unreleased] com Wizard, páginas onboarding, hook, adapters STT/TTS/Talker
- Commit `docs: atualizar AGENTS.md e CHANGELOG.md com onboarding` e push
- Validação `npm run build` e `npm run lint` sem erros

## Fase 16 - Correção de import do tipo Profile em HomePage

**O que foi pedido**
Fixar erro TS "Cannot find name 'Profile'" em `src/pages/HomePage.tsx` linha 11.

**Como foi pedido**
Solicitação natural para corrigir código com conteúdo do arquivo fornecido e problema descrito.

**O que foi entregue**
- Identificado tipo `Profile` em `src/types/profile.ts` já utilizado em `PerfilPage.tsx`
- Adicionado `import type { Profile } from '../types/profile'` em `HomePage.tsx`
- Validação `npm run lint` e `npm run build` sem erros
- `CHANGELOG.md` atualizado com Fixed
- `AI_USAGE.md` atualizado com Fase 16
- `AGENTS.md` mantido consistente com estrutura atual

## Fase 11 - Documentação de purge Cloudflare e governança de produção

**O que foi pedido**
Salvar procedimento de purge da Cloudflare em AGENTS.md para não perder novamente, após correção de db error no fluxo de confirmação por e-mail.

**Como foi pedido**
Solicitação natural para registrar passo-a-passo de purge usando token `CLOUDFLARE_PURGE_TOKEN` em `~/.zshrc`, zona `caa770491f641bf280d7eac3843f6e84`, com curl para `senior-conecta.zoryuz.com` e `conecta-senior.zoryuz.com`.

**O que foi entregue**
- Verificação de token via `source ~/.zshrc && printenv | grep CLOUDFLARE`
- Listagem de zona via API Cloudflare confirmando ID `caa770491f641bf280d7eac3843f6e84`
- Execução de purge por arquivos específicos e purge total da zona, ambos retornando `{"success":true}`
- Atualização de `AGENTS.md` com seção Operações de produção / Purge Cloudflare
- Atualização de `CHANGELOG.md` com registro de documentação
- Atualização de `AI_USAGE.md` com Fase 11

## Fase 10 - Fluidez visual inspirada na WelcomePage

**O que foi pedido**
WelcomePage está perfeita com elegância e separação de partes, mas as demais páginas estavam soltas. Quer algo mais fluido e semelhante à WelcomePage, mantendo foco em pessoas 60+.

**Como foi pedido**
Solicitação natural para comparar e criar plano de ajuste para deixar as páginas tão boas quanto a WelcomePage.

**O que foi entregue**
- Análise comparativa: WelcomePage usa layout full-screen duas colunas, imagem de fundo com gradientes, tipografia grande, espaçamento generoso; páginas de step estavam em card centralizado com espaçamento pequeno e inline styles
- `PageTemplate` ampliado para `max-w-5xl`, padding maior, cantos `rounded-[2.5rem]`
- `StepTemplate` melhorado com tipografia `text-3xl md:text-4xl lg:text-5xl`, gap `10`, barra progresso com `bg-primary`
- Criado `HeroStepTemplate` com grid `md:grid-cols-[1.1fr_1.9fr]`, painel visual esquerdo com imagem/gradiente e conteúdo direito
- `RegistrationPage` migrado para `HeroStepTemplate`, formulário com espaçamento `space-y-8`, botão full-width
- `InterviewPage` com card de pergunta, badge de progresso, textarea destacado e navegação em linha
- `PreferencesPage` com seleção em grid de botões grandes `min-h-[84px]`, estados ativos com `bg-primary`
- `ResumePage` com prévia visual de currículo, avatar, competências e interesses em cards
- Remoção de `style` inline, adoção total de Tailwind
- Atualização de `AGENTS.md`, `CHANGELOG.md` e `AI_USAGE.md` conforme governança
- Build validado com sucesso

---

**Resumo geral**
Todas as solicitações foram interpretadas por linguagem natural, traduzidas para especificações técnicas concretas, implementadas com validação de lint/build, documentadas em tarefas e commits, e alinhadas às diretrizes de acessibilidade WCAG para usuários 60+.

---

## 2026-11-26 Correção de erros de tipo (Claude Code)

**O que foi pedido:** analisar os 3 repos do conecta-senior e começar os ajustes para entrega do trabalho.
**Como foi pedido:** linguagem natural, em sessão com Claude Code (Opus) no VS Code.
**O que foi entregue:**
- Corrigidos 3 erros de `tsc --noEmit` que o build do Vite não acusava (`HomePage`, `MinhasVagasPage`, `RevisaoPage`)
- Validação: `tsc --noEmit`, `npm run lint` e `npm run build` sem erros
