describe('Onboarding Wizard Flow', () => {
  beforeEach(() => {
    // Usar localhost:5173 para testes locais
    cy.visit('http://localhost:5173/comecar/metodo')
  })

  it('navega metodo -> curriculo -> passo 1-6 -> revisao -> confirmado', () => {
    // Metodo
    cy.contains(/método/i).should('be.visible')
    cy.get('button').contains(/continuar/i).click()

    // Curriculo
    cy.url().should('include', '/comecar/curriculo')
    cy.contains(/currículo/i).should('be.visible')
    // Simula upload ou pula
    cy.get('button').contains(/continuar/i).click()

    // Wizard passos
    for (let i = 1; i <= 6; i++) {
      cy.url().should('include', `/comecar/passo/${i}`)
      cy.contains(`Passo ${i} de 7`).should('be.visible')
      cy.get('button').contains(/continuar/i).click()
    }

    // Revisao
    cy.url().should('include', '/comecar/revisao')
    cy.contains(/revisão/i).should('be.visible')
    cy.get('button').contains(/confirmar/i).click()

    // Confirmado
    cy.url().should('include', '/comecar/confirmado')
    cy.contains(/perfil confirmado/i).should('be.visible')
    cy.get('button').contains(/continuar/i).click()

    // Redireciona para / ou /vagas
    cy.url().should('match', /\/$|\/vagas/)
  })
})
