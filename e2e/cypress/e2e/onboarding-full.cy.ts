// @ts-nocheck
describe('Onboarding E2E Completo', () => {
  beforeEach(() => {
    cy.clearLocalStorage()
  })

  it('fluxo manual completo com dados fictícios', () => {
    cy.visit('http://localhost:5173/comecar/metodo')
    cy.contains(/Como você prefere preencher/i).should('be.visible')
    cy.contains(/Preencher digitando/i).click()

    // Passo 1 - Dados básicos
    cy.url().should('include', '/comecar/passo/1')
    cy.contains('Passo 1 de 7').should('be.visible')
    // Preenche campos básicos se existirem
    cy.get('input').then($inputs => {
      if ($inputs.length >= 3) {
        cy.wrap($inputs[0]).type('Charlen Rodrigues')
        cy.wrap($inputs[1]).type('São Paulo')
        cy.wrap($inputs[2]).type('SP')
        if ($inputs.length > 3) cy.wrap($inputs[3]).type('11999998888')
      }
    })
    cy.get('button').contains(/Continuar/i).click()

    // Passo 2 - Experiências
    cy.url().should('include', '/comecar/passo/2')
    cy.contains('Passo 2 de 7').should('be.visible')
    cy.get('button').contains(/Continuar/i).click()

    // Passo 3 - Formação
    cy.url().should('include', '/comecar/passo/3')
    cy.contains('Passo 3 de 7').should('be.visible')
    cy.get('button').contains(/Continuar/i).click()

    // Passo 4 - Habilidades
    cy.url().should('include', '/comecar/passo/4')
    cy.contains('Passo 4 de 7').should('be.visible')
    cy.get('button').contains(/Comunicação/i).click()
    cy.get('button').contains(/Continuar/i).click()

    // Passo 5 - Preferências
    cy.url().should('include', '/comecar/passo/5')
    cy.contains('Passo 5 de 7').should('be.visible')
    cy.get('button').contains(/Continuar/i).click()

    // Passo 6 - Sobre mim
    cy.url().should('include', '/comecar/passo/6')
    cy.contains('Passo 6 de 7').should('be.visible')
    cy.get('button').contains(/Continuar/i).click()

    // Passo 7
    cy.url().should('include', '/comecar/passo/7')
    cy.contains('Passo 7 de 7').should('be.visible')
    cy.get('button').contains(/Continuar/i).click()

    // Revisão
    cy.url().should('include', '/comecar/revisao')
    cy.contains(/Revisão do perfil/i).should('be.visible')
    cy.get('button').contains(/Confirmar/i).click()

    // Confirmado
    cy.url().should('include', '/comecar/confirmado')
    cy.contains(/Perfil confirmado/i).should('be.visible')
  })

  it('fluxo currículo - navegação até revisão', () => {
    cy.visit('http://localhost:5173/comecar/metodo')
    cy.contains(/Enviar currículo em PDF/i).click()
    cy.url().should('include', '/comecar/curriculo')
    cy.contains(/Enviar currículo em PDF/i).should('be.visible')
    // Não faz upload real, apenas valida navegação de volta
    cy.get('button').contains(/Voltar/i).click()
    cy.url().should('include', '/comecar/metodo')
  })

  it('fluxo voz - navegação até página de voz', () => {
    cy.visit('http://localhost:5173/comecar/metodo')
    cy.contains(/Responder falando/i).click()
    cy.url().should('include', '/comecar/voz')
    cy.contains(/Voz/i).should('be.visible')
  })
})
