import { defineConfig } from 'cypress'

export default defineConfig({
  e2e: {
    baseUrl: process.env.CYPRESS_BASE_URL || 'https://senior-conecta.zoryuz.com',
    specPattern: 'e2e/cypress/e2e/**/*.cy.{js,ts,jsx,tsx}',
    supportFile: 'e2e/cypress/support/e2e.ts',
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
})
