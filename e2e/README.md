# E2E com Cypress

Pasta `e2e/` para testes end-to-end do front publicado em https://senior-conecta.zoryuz.com/

## Executar

```bash
# Produção
npm run cypress:open
npm run cypress:run

# Localhost
CYPRESS_BASE_URL=http://localhost:5173 npm run cypress:run
```

## Estrutura

## Estrutura

- `e2e/cypress.config.ts` – baseUrl apontando para produção
- `e2e/cypress/e2e/**/*.cy.ts` – specs
- `e2e/cypress/support/` – comandos e setup global

## Primeiro teste

`welcome.cy.ts` valida que a landing carrega e exibe o CTA inicial.
