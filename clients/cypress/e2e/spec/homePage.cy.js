describe("Home Page", () => {
  beforeEach(() => {
    cy.visit("/")
  })

  it("displays the app title and description", () => {
    cy.contains("AI Developer Assistant").should("be.visible")
    cy.contains("Your personalized assistant to build, debug, and ship code faster.").should("be.visible")

    cy.percySnapshot('Home Page - Title and description visible')
  })

  it('shows sign up and Log in buttons if not logged in', () => {
    cy.contains("Sign Up").should("be.visible")
    cy.contains("Log In").should("be.visible")

    cy.percySnapshot('Home Page - Sign Up and Log In buttons visible')
  })

  it('has a prompt input and send button', () => {
    cy.get('input[placeholder="Ask your Assistant..."]').should("be.visible")
    cy.get('button').contains("Send").should("be.visible")

    cy.percySnapshot('Home Page - Prompt input and Send button visible')
  })

  it('prevents search with empty query', () => {
    cy.contains('Send').click();
    cy.url().should('eq', 'http://localhost:5173/')

    cy.percySnapshot('Home Page - Prevent search with empty query')
  })

  it('updates input value when typing', () => {
    cy.get('input[placeholder= "Ask your Assistant..."]').type('Build a protfolio website');
    cy.get('input[placeholder= "Ask your Assistant..."]').should('have.value', 'Build a protfolio website')

    cy.percySnapshot('Home Page - Prompt input updated with typed value')
  })

  it('adds app type suggestion to the prompt', () => {
    cy.contains('Portfolio', { timeout: 10000 }).should('be.visible').click()
    cy.get('input[placeholder="Ask your Assistant..."]').should('have.value', 'Portfolio')

    cy.percySnapshot('Home Page - App type suggestion added to prompt')
  })

  it('add color scheme suggestion to the prompt', () => {
    cy.contains('🎨 Color Scheme').click()
    cy.contains('🌙 Dark Theme').click()
    cy.get('input[placeholder= "Ask your Assistant..."]').should('have.value', 'Dark Theme')

    cy.percySnapshot('Home Page - Color scheme suggestion added to prompt')
  })

  it('adds layout suggestion to the prompt', () => {
    cy.contains('📐 Layout').scrollIntoView().click({ force: true })
    cy.contains('Grid Layout').scrollIntoView().click({ force: true })
    cy.get('input[placeholder="Ask your Assistant..."]').should('have.value', 'Grid Layout')

    cy.percySnapshot('Home Page - Layout suggestion added to prompt')
  })

  it('shows loading spinner when sending a request', () => {
    cy.intercept('POST', '/api/ai/generate', (req) => {
      req.on('response', (res) => {
        res.setDelay(500) 
      })
    }).as('generateCode')

    cy.get('input[placeholder= "Ask your Assistant..."]').type('create a frontend website based on Instagram')
    cy.contains('Send').click()

    cy.get('svg.animate-spin').should('be.visible')

    cy.percySnapshot('Home Page - Loading spinner visible')

    cy.wait('@generateCode')
    cy.url().should('include', '/result')
  })

})
