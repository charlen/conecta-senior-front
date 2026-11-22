# E2E com Cypress

Pasta `e2e/` para testes end-to-end do front publicado em https://senior-conecta.zoryuz.com/

## Executar

```bash
npm run cypress:open   # abre o runner interativo
npm run cypress:run    # headless
```

## Estrutura

- `e2e/cypress.config.ts` – baseUrl apontando para produção
- `e2e/cypress/e2e/**/*.cy.ts` – specs
- `e2e/cypress/support/` – comandos e setup global

## Primeiro teste

`welcome.cy.ts` valida que a landing carrega e exibe o CTA inicial.
