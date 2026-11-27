# AGENTS.md - conecta-senior-front

Este repositório segue os princípios do Titan Ecosystem.

Ver `PRINCIPLES.md` para modo de trabalho, qualidade e governança.

## Convenções
- TypeScript strict
- Atomic Design: atoms/molecules/organisms/templates/pages
- Mensagens UI em português, código em inglês
- TailwindCSS 4 com `@import "tailwindcss"` + `@config "../tailwind.config.js"` em `src/index.css` (sem o `@config` as cores do tema não existem); escala de fontes padrão do Tailwind
- Cor primária registrada no tema: `primary: '#2563eb'`
- Acessibilidade 60+: tamanhos mínimos text-xl, botões min-h-[56px], contraste alto, espaçamento generoso
- Tokens legados em `src/styles/tokens.css` mantidos para referência

## Estrutura atual
```
src/
  components/
    atoms/        Avatar, Button, Input, Textarea, Label, Container, Heading, Pill, Text
    molecules/    ButtonRow, Card, ChipButton, ChipGroup, FormField, StepHeader, BarraProgresso, LegalLinks, ProfileField, SummaryCard, Alerta, CartaoOpcao, ConfirmModal, JobCard, CodeField, ResendCode, EmailField, ShowPasswordToggle, Dropdown
    organisms/    RegistrationForm, InterviewStep, WelcomeSection, ProfileReviewFlow, ProfileSectionFields, PhotoEditor, PasswordChangeForm, CandidateMatchCard
    templates/    PageTemplate, StepTemplate, HeroStepTemplate, HeroPageTemplate, LegalPageTemplate, AuthStepTemplate
  content/       legal.ts (textos da Política de Privacidade e Termos de Uso)
  contexts/      FlowContext, AuthContext
  hooks/         useFlow, useRascunhoPerfil, useCandidateProfile, useFieldError, useCountdown
  mocks/         data.ts
  pages/         WelcomePage, RegistrationPage, InterviewPage, ResumePage, PreferencesPage, JobsPage, MatchingPage, DashboardPage, WizardPage, CurriculoPage, VozPage, RevisaoPage, ConfirmadoPage, HomePage, PerfilPage, PrivacidadePage, TermosPage, CadastroPage, EntrarPage, CandidatosVagaPage
  services/      mockApi.ts, authApi.ts, profileApi.ts, jobsApi.ts, companyJobsApi.ts
  types/         candidate.ts, job.ts, jobCandidates.ts, legal.ts, perfil.ts, profile.ts, resume.ts
  utils/         contact.ts (mailto/tel/wa.me), profileMapping.ts, profileValidation.ts, image.ts
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
- Listas suspensas sempre via `Dropdown` (molecule, WAI-ARIA combobox); nunca `<select>` nativo
- Diálogos de confirmação sempre via `ConfirmModal` (molecule); ações destrutivas usam `tone="danger"`. Nunca usar `window.confirm`
- Perfil do candidato: modelo canônico em `src/types/candidate.ts` (espelha `internal/domain/candidate` do backend); exibido como resumo em cartões (`ProfileReviewFlow`, padrão "confira suas respostas") e editado uma seção por vez em tela focada; cada "Salvar" faz `PUT /profiles/me` (backend aceita perfil incompleto e bloqueia só valores inválidos)
- Vagas do candidato (`/vagas`): ordenadas por compatibilidade via `GET /match/me` (`jobsApi`); candidatura com confirmação via `POST/DELETE /jobs/:id/apply`
- Lado empresa: `/minhas-vagas` → "Ver candidatos" → `/vagas/:id/candidatos` (lista por compatibilidade via `GET /jobs/:id/candidates`, selo e filtro de quem se candidatou, contato via WhatsApp/tel/mailto)
- Autenticação (`/cadastro`, `/entrar`) usa `AuthStepTemplate`: uma pergunta por tela, "Passo X de Y", erros no campo via `ProfileField`/`useFieldError`; chamadas só via `authApi`
- Páginas legais públicas: `/privacidade` e `/termos` (conteúdo em `src/content/legal.ts`, e-mail de contato em `LEGAL_CONTACT_EMAIL`)
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

