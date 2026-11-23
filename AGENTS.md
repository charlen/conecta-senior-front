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
    molecules/    ButtonRow, Card, ChipButton, ChipGroup, FormField, StepHeader, BarraProgresso
    organisms/    RegistrationForm, InterviewStep, WelcomeSection
    templates/    PageTemplate, StepTemplate, HeroStepTemplate, HeroPageTemplate
  contexts/      FlowContext, AuthContext
  hooks/         useFlow, useRascunhoPerfil
  mocks/         data.ts
  pages/         WelcomePage, RegistrationPage, InterviewPage, ResumePage, PreferencesPage, JobsPage, MatchingPage, DashboardPage, WizardPage, CurriculoPage, VozPage, RevisaoPage, ConfirmadoPage, HomePage, PerfilPage
  services/      mockApi.ts, authApi.ts
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
- Onboarding manual via `WizardPage` com `BarraProgresso`, navegação Voltar/Continuar, validação gentil e “Adicionar outra” para experiências/formação
- Páginas seguem `StepTemplate` ou `HeroStepTemplate` com barra de progresso e layout fluido duas colunas
- Landing inicial em `WelcomePage` com layout duas colunas
- Vagas em cards Tailwind com badges e tag de compatibilidade
- Rotas onboarding: `/comecar/metodo`, `/comecar/voz`, `/comecar/curriculo`, `/comecar/passo/:n`, `/comecar/revisao`, `/comecar/confirmado`

## Governança de artefatos
- Após cada pedido/entrega, atualizar `AGENTS.md`, `CHANGELOG.md` e `AI_USAGE.md`
- `AGENTS.md` deve refletir convenções, estrutura atual e padrões de nomenclatura
- `CHANGELOG.md` deve registrar alterações em [Unreleased] e versões concluídas
- `AI_USAGE.md` deve registrar: o que foi pedido, como foi pedido e o que foi entregue
- Código em inglês, textos de UI em português
- Validação obrigatória: `npm run build` e `npm run lint` sem erros
- **Sempre validar build Go antes de commit**: `go build -o /tmp/main ./cmd` deve passar sem erros

## Operações de produção
### Purge Cloudflare
Zona `zoryuz.com` ID: `caa770491f641bf280d7eac3843f6e84`
Token env: `CLOUDFLARE_PURGE_TOKEN` definido em `~/.zshrc`

Carregar env e purgar arquivos específicos:
```bash
source ~/.zshrc
curl -X POST "https://api.cloudflare.com/client/v4/zones/caa770491f641bf280d7eac3843f6e84/purge_cache" \
  -H "Authorization: Bearer $CLOUDFLARE_PURGE_TOKEN" \
  -H "Content-Type: application/json" \
  --data '{"files":["https://senior-conecta.zoryuz.com/","https://senior-conecta.zoryuz.com/confirm","https://conecta-senior.zoryuz.com/"]}'
```

Purge total da zona:
```bash
source ~/.zshrc
curl -X POST "https://api.cloudflare.com/client/v4/zones/caa770491f641bf280d7eac3843f6e84/purge_cache" \
  -H "Authorization: Bearer $CLOUDFLARE_PURGE_TOKEN" \
  -H "Content-Type: application/json" \
  --data '{"purge_everything":true}'
```

Executar purge após cada merge de front/backend que altera assets ou rotas SPA.

