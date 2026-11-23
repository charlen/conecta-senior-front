// @ts-nocheck
describe('Welcome page', () => {
  it('loads and shows heading', () => {
    cy.visit('/')
    cy.contains(/conecta senior/i).should('be.visible')
    cy.get('button').contains(/começar/i).should('be.visible')
  })
})
