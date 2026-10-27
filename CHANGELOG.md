# Changelog

## [Unreleased]

### Added
- Internacionalização dos nomes de código para inglês
  - Páginas: CadastroPage → RegistrationPage, EntrevistaPage → InterviewPage, CurriculoPage → ResumePage, PreferenciasPage → PreferencesPage, VagasPage → JobsPage, PainelPage → DashboardPage
  - Organisms: CadastroForm → RegistrationForm, EntrevistaStep → InterviewStep
  - Context/Hook: FluxoContext → FlowContext, useFluxo → useFlow
- Manutenção de textos de UI em português
- Atualização de imports e referências em App.tsx, páginas e componentes

### Changed
- Refatoração de fluxo para layout fluido inspirado na WelcomePage
  - `PageTemplate` ampliado para `max-w-5xl` com padding generoso e cantos arredondados `rounded-[2.5rem]`
  - `StepTemplate` com tipografia maior, espaçamento `gap-10` e barra de progresso usando `bg-primary`
  - Novo `HeroStepTemplate` com grid duas colunas, painel visual esquerdo com imagem/gradiente e conteúdo direito
  - Novo `HeroPageTemplate` com layout full-screen, painel visual esquerdo fora do card e card branco alinhado à direita ocupando todo o conteúdo
  - `RegistrationPage`, `InterviewPage`, `PreferencesPage`, `ResumePage` migrados para `HeroPageTemplate` com card alinhado à direita em desktop
  - `RegistrationPage` com formulário melhor espaçado, botão full-width
  - `InterviewPage` com card de pergunta, badge de progresso, textarea destacado e navegação em linha
  - `PreferencesPage` com seleção em grid de botões grandes, min-h-[84px], estados ativos com `bg-primary`
  - `ResumePage` com prévia visual de currículo, avatar, competências e interesses em cards
- Remoção de `style` inline em favor de classes Tailwind
- Consistência de tamanhos mínimos 56px para botões, textos `text-xl`+

## [2026-10-27] Refatoração UI para Tailwind v4 e acessibilidade 60+

### Added
- Configuração Tailwind v4 com `@import "tailwindcss"`, `tailwind.config.js` e `postcss.config.js`
- Landing page inicial com layout duas colunas em `WelcomePage`
- Componentes Atoms/Molecules/Organisms/Templates refatorados para Tailwind
- Barra de progresso no StepTemplate com cor primária
- Cards de vagas com badges, tags e destaque de compatibilidade
- Aviso MVP estilizado com contraste acessível

### Changed
- `Button` com tamanho mínimo 56px, texto-xl, cor primária `#2563eb`
- `Input`/`Textarea` com padding maior, borda 2px, foco ring-4
- `PageTemplate` com container max-w-3xl e espaçamento generoso
- `WelcomeSection` substituído por landing page de duas colunas
- Cor primária alterada de `#0ac` para azul `#2563eb` para melhor contraste
- `AGENTS.md` atualizado com estrutura atual e diretrizes de acessibilidade

### Fixed
- Geração de classes Tailwind v4 e visibilidade do botão primário
- Barra de progresso com background inline para garantir cor
- Conflito de classes `bg-white` vs `bg-primary` no Button


