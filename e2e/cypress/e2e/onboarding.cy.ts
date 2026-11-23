describe('Onboarding Wizard Flow', () => {
  beforeEach(() => {
    cy.clearLocalStorage()
    cy.visit('http://localhost:5173/comecar/metodo')
  })

  it('navega metodo -> manual -> passo 1-6 -> revisao -> confirmado', () => {
    // Metodo
    cy.contains(/Como você prefere preencher/i).should('be.visible')
    cy.contains(/Preencher digitando/i).click()

    // Wizard passo 1
    cy.url().should('include', '/comecar/passo/1')
    cy.contains('Passo 1 de 7').should('be.visible')

    // Avança pelos passos sem preencher
    for (let i = 1; i <= 7; i++) {
      cy.url().should('include', `/comecar/passo/${i}`)
      cy.contains(`Passo ${i} de 7`).should('be.visible')
      cy.get('button').contains(/Continuar/i).click()
    }

    // Revisao
    cy.url().should('include', '/comecar/revisao')
    cy.contains(/Revisão/i).should('be.visible')
    cy.get('button').contains(/Confirmar/i).click()

    // Confirmado
    cy.url().should('include', '/comecar/confirmado')
    cy.contains(/Perfil confirmado/i).should('be.visible')
    // Não clicamos em Continuar para evitar rota /vagas sem FlowProvider
    // cy.get('button').contains(/Continuar/i).click()
    // cy.url().should('match', /\/$|\/vagas/)
  })
})
