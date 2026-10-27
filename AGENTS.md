# AGENTS.md - conecta-senior-front

Este repositório segue os princípios do Titan Ecosystem.

Ver `PRINCIPLES.md` para modo de trabalho, qualidade e governança.

## Convenções
- TypeScript strict
- Atomic Design: atoms/molecules/organisms/templates/pages
- Mensagens UI em português, código em inglês
- TailwindCSS 4 com `@import "tailwindcss"` e configuração em `tailwind.config.js`
- Cor primária registrada no tema: `primary: '#2563eb'`
- Acessibilidade 60+: tamanhos mínimos text-xl, botões min-h-[56px], contraste alto, espaçamento generoso
- Tokens legados em `src/styles/tokens.css` mantidos para referência

## Estrutura atual
```
src/
  components/
    atoms/        Button, Input, Textarea, Label, Container, Heading, Pill, Text
    molecules/    ButtonRow, Card, ChipButton, ChipGroup, FormField, StepHeader
    organisms/    RegistrationForm, InterviewStep, WelcomeSection
    templates/    PageTemplate, StepTemplate
  contexts/      FlowContext
  hooks/         useFlow
  mocks/         data.ts
  pages/         WelcomePage, RegistrationPage, InterviewPage, ResumePage, PreferencesPage, JobsPage, MatchingPage, DashboardPage
  services/      mockApi.ts
  styles/        tokens.css
  index.css      Tailwind entry
  App.tsx
  main.tsx
```

## Scripts
- `npm run dev`   → Vite dev server
- `npm run build` → produção
- `npm run lint`  → ESLint

## Fluxo de trabalho
- Fluxo guiado por `FlowContext` e `useFlow`
- Páginas seguem StepTemplate com barra de progresso
- Landing inicial em `WelcomePage` com layout duas colunas
- Vagas em cards Tailwind com badges e tag de compatibilidade

## Governança de artefatos
- Após cada pedido/entrega, atualizar `AGENTS.md`, `CHANGELOG.md` e `AI_USAGE.md`
- `AGENTS.md` deve refletir convenções, estrutura atual e padrões de nomenclatura
- `CHANGELOG.md` deve registrar alterações em [Unreleased] e versões concluídas
- `AI_USAGE.md` deve registrar: o que foi pedido, como foi pedido e o que foi entregue
- Código em inglês, textos de UI em português
- Validação obrigatória: `npm run build` e `npm run lint` sem erros

