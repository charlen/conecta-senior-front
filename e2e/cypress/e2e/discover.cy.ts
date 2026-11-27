// @ts-nocheck
describe('Page discovery detailed', () => {
  it('captures home', () => {
    cy.visit('/')
    cy.get('body').then($body => {
      cy.writeFile('e2e/discovery.txt', $body.text())
    })
  })
})
