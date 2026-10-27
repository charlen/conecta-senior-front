# Changelog

## [Unreleased]

### Added
- Estrutura inicial do projeto

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


